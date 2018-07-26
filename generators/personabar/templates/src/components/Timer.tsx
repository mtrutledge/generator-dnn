import * as React from "react";

interface TimerProps {
  value: number;
  seconds: number;
}

class Timer extends  React.Component<TimerProps, {}> {
render() {
    return (
    <div>
        <h1 style={{ fontSize: 100, marginLeft:100 }}>{this.props.value}:{this.props.seconds}</h1>
    </div>
    );
}
}

export default Timer;