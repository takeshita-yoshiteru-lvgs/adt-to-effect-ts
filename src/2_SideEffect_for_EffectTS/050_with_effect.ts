import "reflect-metadata";
import assert from "assert";
import { Effect, Context } from "effect";

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

function autoTurnOnAC(
  userId: number
): Effect.Effect<
  "TurnOn" | "EnoughTemperature" | "NotWakeUpTime",
  "ACNetworkError",
  DBConnection | RemoteController | Clock
> {
  return Effect.succeed("TurnOn");
}

async function test() {
  /* Compile error
  const runnable = autoTurnOnAC(1);
  await Effect.runPromise(runnable);
  */
  const runnable = Effect.provideService(
    Effect.provideService(
      Effect.provideService(autoTurnOnAC(1), DBConnection, {
        executeQuery: (query: string) =>
          Effect.succeed([{ temperatureThreshold: 20, wakeUpHour: 8 }]),
      }),
      RemoteController,
      {
        getTemperature: () => Effect.succeed(20),
        turnOnAC: () => Effect.succeed(undefined),
      }
    ),
    Clock,
    {
      getNow: () => Effect.succeed(new Date("2021-01-01T07:00:00Z")),
    }
  );

  const r = await Effect.runPromise(runnable);
  assert(r === "TurnOn");
}
