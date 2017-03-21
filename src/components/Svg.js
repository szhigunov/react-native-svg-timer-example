import Svg, {
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    ClipPath,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

import {branch} from 'baobab-react/higher-order';
import BackgroundTimer from 'react-native-background-timer';

var Morph = require('art/morph/path');

import React, { Component } from 'react';

console.log = () => {};

class SVGObject extends Component {
  constructor() {
    super();

    this.state = {
      min: '00',
      sec: '00',
      remaining: null,
      timer: null,
      isRunning: false };
    this.tickTimer = this.tickTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
  }
  static contextTypes = {
    tree: React.PropTypes.object
  }
  componentDidMount() {
    if (this.props.interval && this.props.isStarted) {
      this.startTimer(this.props.interval);
    }
  }
  
  shouldComponentUpdate(props, state) {
    if(state.min !== this.state.min || state.sec !== this.state.sec ) return true;
    return props.isStarted;
  }
  componentWillReceiveProps(props) {
    if (props.reset !== this.props.reset ) {
      if (props.reset) {
        const time = new Date(+(new Date) + props.interval * 1000);
        const currentTime = new Date();
        const remaining = time - currentTime;
        const min = ('0' + new Date(remaining).getMinutes()).slice(-2);
        const sec = ('0' + new Date(remaining).getSeconds()).slice(-2);
        this.props.dispatch((tree, value) => { tree.set('min', value)}, min);
        this.props.dispatch((tree, value) => { tree.set('sec', value)}, sec);
        this.setState({
          min,
          sec,
          timer: null,
          remaining: null,
          isRunning: false
        });
      }
    }
    if (props.isStarted !== this.props.isStarted) {
      console.log('isStarted changed')
      if (props.isStarted) {
        console.log(props);
        console.log('isStarted = true');
        this.startTimer(props.interval);
      } else {
        console.log('isStarted = false')
        console.log('timer', !!this.state.timer);

        if (this.state.timer && props.isPaused) {
          console.log('isPaused = true')
          this.pauseTimer();
        } else {
          console.log('isPaused = false')
        }
      }
    }
  }

  pauseTimer() {
    if (this.state.timer) {
      const time = this.state.time - this.state.remaining;
      BackgroundTimer.clearInterval(this.state.timer);
      this.setState({
        timer: null,
        time
      });
      console.log('timer paused', this.state.remaining);
    } else {
      BackgroundTimer.clearInterval(this.state.timer);
      this.setState({
        timer: null
      });
      Alert.alert('already paused');
    }
  }

  startTimer(interval) {
    if (this.state.remaining) {
      console.log('paused remaining time = ', this.state.remaining);
      this.setState({
        time: new Date(+(new Date) + this.state.remaining),
        timer: BackgroundTimer.setInterval(() => { this.tickTimer() }, 100)});
    } else {
      console.log('start new timer', interval);
      const time = new Date(+(new Date) + interval * 1000);
      console.log('end time = ', time);

      this.setState({
        time,
        timer: BackgroundTimer.setInterval(() => { this.tickTimer() }, 100)
      });
    }
  }

  tickTimer() {
    var time = this.state.time;
    var currentTime = new Date();
    var remaining = time - currentTime;

    if (remaining >= 0) {
      console.log('ticked', remaining);

      const min = ('0' + new Date(remaining).getMinutes()).slice(-2);
      const sec = ('0' + new Date(remaining).getSeconds()).slice(-2);
      
      this.props.dispatch((tree, value) => { tree.set('min', value)}, min);
      this.props.dispatch((tree, value) => { tree.set('sec', value)}, sec);
      
      this.setState({
        remaining,
        min,
        sec
      });

      if ( !this.props.isStarted ) {
        return false;
      }
    } else {
      console.log('tick timer end case');
      BackgroundTimer.clearInterval(this.state.timer);

      this.setState({
        remaining: null,
        timer: null,
        time: null,
        min: '00',
        sec: '00'
      });

      this.props.dispatch((tree, value) => { tree.set('min', value)}, '00');
      this.props.dispatch((tree, value) => { tree.set('sec', value)}, '00');

      this.props.onEnd();
    }
  }
  render() {
    const interval = this.props.interval * 1000;
    const { min, sec, remaining } = this.state;
    let offset = 0;

    if ( remaining ) {
      offset = 100 - (100 / Math.abs(interval / remaining));
    } else {
      offset = 0;
    }

    return (
    <Svg height="250" width="250" >
      <Defs>
        <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop
                offset="100%"
                stopColor="#000000"
                stopOpacity="0.1"
            />
            <Stop
                offset={`${offset}%`}
                stopColor="#e74c3c"
                stopOpacity="1"
            />
        </RadialGradient>
      </Defs>

      <Circle
        onPressIn={() => this.props.onPress()}
        cx="125"
        cy="125"
        r="120"
        stroke="#e74c3c"
        strokeWidth="5"
        fill="url(#grad)"
      />
      <Text
          x="50%"
          y="40%"
          fontSize="36"
          fill="#fff"
          fonWeight="bold"
          textAnchor="middle"
          scale="1.5"
      >{min}:{sec}</Text>
    </Svg>);
  }
}

export default branch({ min: 'min', sec: 'sec' }, SVGObject);