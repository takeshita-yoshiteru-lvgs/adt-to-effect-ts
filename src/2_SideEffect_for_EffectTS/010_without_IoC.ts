import assert from "assert";

// DB読み書きのライブラリのダミー
class DBConnection {
  executeQuery(query: string): Promise<any> {
    return Promise.resolve([{ temperatureThreshold: 20, wakeUpHour: 8 }]);
  }
}
// センサー、エアコンのリモコンのライブラリのダミー
class RemoteController {
  getTemperature(): Promise<number> {
    return Promise.resolve(20);
  }
  turnOnAC(): Promise<void> {
    return Promise.resolve();
  }
}

export class AutoACController {
  /**
   * 起床の1時間前に、室温が設定以下の場合、エアコンを自動でつける
   * @param userId
   * @returns
   */
  async autoTurnOnAC(userId: number): Promise<boolean> {
    const dbConnection = new DBConnection();
    const remoteController = new RemoteController();

    const [{ temperatureThreshold, wakeUpHour }] =
      await dbConnection.executeQuery(
        `SELECT * FROM UserSetting WHERE userId = ${userId}` // SQLInjectionは無視
      );
    const temperature = await remoteController.getTemperature();

    if (temperature > temperatureThreshold) {
      console.log("設定温度より高いのでエアコンを付けない");
      return false;
    }

    const currentTime = new Date();
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
      await remoteController.turnOnAC();
    } catch (e: unknown) {
      console.error(e);
      return false;
    }

    return true;
  }
}

async function test() {
  // 実行する時間帯や季節で結果が変わる
  // また物理のDBやエアコンを用意しないとテスト出来ない
  const autoACController = new AutoACController();

  autoACController.autoTurnOnAC(1).then((result) => {
    assert(result === true);
  });
}
