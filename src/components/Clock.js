import React, { Component } from 'react';

import BackgroundTimer from 'react-native-background-timer';

import {branch} from 'baobab-react/higher-order';

import SvgObject from './SvgObject';

class SVGObject extends Component {
  constructor() {
    super();

    this.state = {
      min: '00',
      sec: '00',
      timer: null,
      remaining: null,
      isRunning: false
    };

    this.tickTimer = this.tickTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
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
  getTimeByInterval(interval) {
    const time = new Date(+(new Date) + interval * 1000);
    const currentTime = new Date();
    const remaining = time - currentTime;
    const min = ('0' + new Date(remaining).getMinutes()).slice(-2);
    const sec = ('0' + new Date(remaining).getSeconds()).slice(-2);

    return {
      remaining,
      min,
      sec
    }
  }

  updateTreeMin(min) {
    this.props.dispatch((tree, value) => { tree.set('min', value)}, min);
  }

  updateTreeSec(sec) {
    this.props.dispatch((tree, value) => { tree.set('sec', value)}, sec);
  }

  componentWillReceiveProps(props) {
    if (props.reset !== this.props.reset ) {
      if (props.reset) {
        const { min, sec } = this.getTimeByInterval(props.interval);
        
        this.updateTreeMin(min);
        this.updateTreeSec(sec);
        
        this.setState({
          min,
          sec,
          timer: null,
          remaining: null,
          time: null,
          isRunning: false
        });
      }
    }

    if (props.isStarted !== this.props.isStarted) {
      if (props.isStarted) {
        this.startTimer(props.interval);
      } else {
        if (this.state.timer && props.isPaused) {
          this.pauseTimer();
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
    } else {
      BackgroundTimer.clearInterval(this.state.timer);
      this.setState({
        timer: null
      });
      Alert.alert('already paused');
    }
  }

  startTimer(interval) {
    if (!interval) { console.log('no interval'); }

    const time = (this.state.remaining) ? new Date(+(new Date) + this.state.remaining) : new Date(+(new Date) + interval * 1000); ;

    this.setState({
      time,
      timer: BackgroundTimer.setInterval(() => { this.tickTimer() }, 100)
    });
  }

  tickTimer() {
    var time = this.state.time;
    var currentTime = new Date();
    var remaining = time - currentTime;

    if (remaining >= 0) {

      const min = ('0' + new Date(remaining).getMinutes()).slice(-2);
      const sec = ('0' + new Date(remaining).getSeconds()).slice(-2);

      this.updateTreeMin(min);
      this.updateTreeSec(sec);

      this.setState({
        remaining,
        min,
        sec
      });

      if ( !this.props.isStarted ) { return false }
    } else {

      BackgroundTimer.clearInterval(this.state.timer);

      this.setState({
        min: '00',
        sec: '00',
        timer: null,
        remaining: null,
        time: null,
        isRunning: false
      });

      this.updateTreeMin('00');
      this.updateTreeSec('00');

      this.props.onEnd();
    }
  }
  render() {
    const { min, sec, remaining } = this.state;
    const interval = this.props.interval * 1000;
    const onPress = this.props.onPress;

    let offset = 0;

    if ( remaining ) {
      offset = 100 - (100 / Math.abs(interval / remaining));
    } else {
      offset = 0;
    }

    const svgObjectProps = {
      min,sec, offset, onPress
    }

    return (
      <SvgObject {...svgObjectProps} />
    );
  }
}

export default branch({ min: 'min', sec: 'sec' }, SVGObject);