import * as React from "react";

interface StartButtonProps {
  value: number;
  startCountDown: (ev) => void;
}

class StartButton extends  React.Component<StartButtonProps, {}>  {
render() {
    return (
    <div style={{ marginLeft: 130 }}>
        <button className="btn btn-lg btn-success" disabled={!this.props.value} onClick={this.props.startCountDown}>Start</button>
    </div>

    );
}
}

export default StartButton;