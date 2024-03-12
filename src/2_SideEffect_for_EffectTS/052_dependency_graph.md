### Effect 化

```mermaid

classDiagram

namespace Effect {
  class autoTurnOnAC {
    <<function>>
  }

  class DBConnection {
    <<Context>>
  }

  class RemoteController {
    <<Context>>
  }

  class Clock{
    <<Context>>
  }
}
namespace Requirements {
  class DBConnectionObj {
    <<object>>
  }
  class RemoteControllerObj {
    <<object>>
  }

  class ClockObj{
    <<object>>
  }
}

autoTurnOnAC --> RemoteController: use
autoTurnOnAC --> DBConnection: use
autoTurnOnAC --> Clock: use

DBConnectionObj --> DBConnection: provide
RemoteControllerObj --> RemoteController
ClockObj --> Clock


```

### 処理の分割

```mermaid

classDiagram

namespace Effect {
  class autoTurnOnAC {
    <<function>>
  }
  class getUserSetting {
    <<function>>
  }
  class checkTemperature {
    <<function>>
  }
  class checkWakeUpTime {
    <<function>>
  }

  class DBConnection {
    <<Context>>
  }

  class RemoteController {
    <<Context>>
  }

  class Clock{
    <<Context>>
  }
}
namespace Requirements {
  class DBConnectionObj {
    <<object>>
  }
  class RemoteControllerObj {
    <<object>>
  }

  class ClockObj{
    <<object>>
  }
}

autoTurnOnAC --> getUserSetting: use
autoTurnOnAC --> checkTemperature: use
autoTurnOnAC --> checkWakeUpTime: use

getUserSetting --> DBConnection: use
checkTemperature --> RemoteController: use
checkWakeUpTime --> Clock: use
checkWakeUpTime --> RemoteController: use

DBConnectionObj --> DBConnection: provide
RemoteControllerObj --> RemoteController
ClockObj --> Clock


```
