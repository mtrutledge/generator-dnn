import * as React from "react";

interface TimerInputProps {
  value: string;
  handleChange: (ev) => void;
}

class TimerInput extends React.Component<TimerInputProps, {}> {
render() {
    return (
    <div style={{marginLeft:100}}>
        <h3>Input your desired time</h3>
        <input type="number" value={this.props.value} onChange={this.props.handleChange} required />
    </div>
    );
}
}

export default TimerInput;