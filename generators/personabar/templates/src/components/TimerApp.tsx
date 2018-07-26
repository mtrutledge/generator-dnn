import * as React from "react";
import Timer from "./components/Timer";
import TimerInput from "./components/TimerInput";
import StartButton from "./components/StartButton";

class App extends React.Component<any, any> {
	secondsRemaining: number;
	intervalHandle: any;

  constructor(props: any) {
    super(props);
    this.state = {
      seconds: '00',
      value: '',
      isClicked : false
    }
    this.secondsRemaining;
    this.intervalHandle;
    this.handleChange = this.handleChange.bind(this);
    this.startCountDown = this.startCountDown.bind(this);
    this.tick = this.tick.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    })
  }

  tick() {
    var min = Math.floor(this.secondsRemaining / 60);
    var sec = this.secondsRemaining - (min * 60);

    this.setState({
      value: min,
      seconds: sec,
    })

    if (sec < 10) {
      this.setState({
        seconds: "0" + this.state.seconds,
      })

    }

    if (min < 10) {
      this.setState({
        value: "0" + min,
      })

    }

    if (min === 0 && sec === 0) {
      clearInterval(this.intervalHandle);
    }


    this.secondsRemaining--
  }

  startCountDown() {
    this.intervalHandle = setInterval(this.tick, 1000);
    let time = this.state.value;
    this.secondsRemaining = time * 60;
    this.setState({
      isClicked : true
    })
  }

  render() {
    const clicked = this.state.isClicked;
    if(clicked){
    return (
      <div>
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <Timer value={this.state.value} seconds={this.state.seconds} />
          </div>
        </div>
      </div>
    );
    }else{
      return (
        <div>
          <div className="row">
            <div className="col-md-4">              
							<TimerInput value={this.state.value} handleChange={this.handleChange} />
              <StartButton startCountDown={this.startCountDown} value={this.state.value} />
						</div>
            <div className="col-md-4">
              <Timer value={this.state.value} seconds={this.state.seconds} />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default TimerApp;