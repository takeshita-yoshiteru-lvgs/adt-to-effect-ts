import "reflect-metadata";
import assert from "assert";
import { Effect, Context, pipe, Predicate } from "effect";
import { Refinement } from "effect/Predicate";

interface UserSetting {
  temperatureThreshold: number;
  wakeUpHour: number;
}

class DBConnection extends Context.Tag("Database")<
  DBConnection,
  {
    executeQuery(query: string): Effect.Effect<any>;
  }
>() {}
class RemoteController extends Context.Tag("RemoteController")<
  RemoteController,
  {
    getTemperature(): Effect.Effect<number>;
    turnOnAC(): Effect.Effect<void>;
  }
>() {}
class Clock extends Context.Tag("Clock")<
  Clock,
  {
    getNow(): Effect.Effect<Date>;
  }
>() {}

function getUserSetting(
  userId: number
): Effect.Effect<UserSetting, never, DBConnection> {
  return Effect.gen(function* (_) {
    const dbConn = yield* _(DBConnection);
    return yield* _(
      dbConn.executeQuery(`SELECT * FROM UserSetting WHERE userId = ${userId}`)
    );
  });
}
function checkTemperature(
  userSetting: UserSetting
): Effect.Effect<void, "EnoughTemperature", RemoteController> {
  return Effect.gen(function* (_) {
    const remoteController = yield* _(RemoteController);
    const temperature = yield* _(remoteController.getTemperature());
    if (temperature > userSetting.temperatureThreshold) {
      return Effect.fail("EnoughTemperature");
    }
  });
}
function checkWakeUpTime(
  userSetting: UserSetting
): Effect.Effect<void, "NotWakeUpTime", Clock> {
  return Effect.gen(function* (_) {
    const clock = yield* _(Clock);
    const now = yield* _(clock.getNow());
    if (
      !(
        now.getHours() >= userSetting.wakeUpHour - 1 &&
        now.getHours() < userSetting.wakeUpHour
      )
    ) {
      return Effect.fail("NotWakeUpTime");
    }
  });
}
function turnOnAC(): Effect.Effect<
  "TurnOn",
  "ACNetworkError",
  RemoteController
> {
  return Effect.gen(function* (_) {
    const remoteController = yield* _(RemoteController);
    yield* _(remoteController.turnOnAC());
    return "TurnOn" as const;
  });
}

function autoTurnOnAC(
  userId: number
): Effect.Effect<
  "TurnOn" | "EnoughTemperature" | "NotWakeUpTime",
  "ACNetworkError",
  DBConnection | RemoteController | Clock
> {
  return Effect.gen(function* (_) {
    const userSetting = yield* _(getUserSetting(userId));
    yield* _(checkTemperature(userSetting));
    yield* _(checkWakeUpTime(userSetting));
    return yield* _(turnOnAC());
  }).pipe(
    Effect.catchIf(
      (v): v is "EnoughTemperature" | "NotWakeUpTime" =>
        v === "NotWakeUpTime" || v === "EnoughTemperature",
      (v) => Effect.succeed(v)
    )
  );
}

async function testGetUserSetting() {
  await Effect.runPromise(
    Effect.provideService(getUserSetting(1), DBConnection, {
      executeQuery: (query: string) =>
        Effect.succeed([{ temperatureThreshold: 20, wakeUpHour: 8 }]),
    })
  );
}
async function testCheckTemperature() {
  await Effect.runPromise(
    Effect.provideService(
      checkTemperature({ temperatureThreshold: 20, wakeUpHour: 8 }),
      RemoteController,
      {
        getTemperature: () => Effect.succeed(20),
        turnOnAC() {
          return Effect.succeed(undefined);
        },
      }
    )
  );
}

async function testCheckWakeUpTime() {
  await Effect.runPromise(
    Effect.provideService(
      checkWakeUpTime({ temperatureThreshold: 20, wakeUpHour: 8 }),
      Clock,
      {
        getNow: () => Effect.succeed(new Date("2021-01-01T07:00:00Z")),
      }
    )
  );
}
