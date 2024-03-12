import assert from "assert";

// DB読み書きのライブラリのダミー
interface DBConnection {
  executeQuery(query: string): Promise<any>;
}
// センサー、エアコンのリモコンのライブラリのダミー
interface RemoteController {
  getTemperature(): Promise<number>;
  turnOnAC(): Promise<void>;
}
interface Clock {
  getNow(): Date;
}

export class AutoACController {
  constructor(
    private readonly dbConnection: DBConnection,
    private readonly remoteController: RemoteController,
    private readonly clock: Clock
  ) {}

  /**
   * 起床の1時間前に、室温が設定以下の場合、エアコンを自動でつける
   * @param userId
   * @returns
   */
  async autoTurnOnAC(userId: number): Promise<boolean> {
    const [{ temperatureThreshold, wakeUpHour }] =
      await this.dbConnection.executeQuery(
        `SELECT * FROM UserSetting WHERE userId = ${userId}` // SQLInjectionは無視
      );
    const temperature = await this.remoteController.getTemperature();

    if (temperature > temperatureThreshold) {
      console.log("設定温度より高いのでエアコンを付けない");
      return false;
    }

    const currentTime = this.clock.getNow();
    if (
      !(
        currentTime.getHours() >= wakeUpHour - 1 &&
        currentTime.getHours() < wakeUpHour
      )
    ) {
      console.log("起床時間の1時間前ではないのでエアコンを付けない");
      return false;
    }
    try {
      console.log("エアコンをつける");
      await this.remoteController.turnOnAC();
    } catch (e: unknown) {
      console.error(e);
      return false;
    }

    return true;
  }
}

async function test() {
  const autoACController = new AutoACController(
    {
      executeQuery: (query: string) =>
        Promise.resolve([{ temperatureThreshold: 20, wakeUpHour: 8 }]),
    },
    {
      getTemperature: () => Promise.resolve(20),
      turnOnAC: () => Promise.resolve(),
    },
    {
      getNow: () => new Date("2021-01-01T07:00:00Z"),
    }
  );

  autoACController.autoTurnOnAC(1).then((result) => {
    assert(result === true);
  });
}
