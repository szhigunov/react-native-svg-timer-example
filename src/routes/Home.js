import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, Alert, AlertIOS, Platform, Button, Vibration } from 'react-native';
import styles from '../styles/Home';
import Prompt from 'react-native-prompt-android';
import SVGClock from '../components/Svg.js';


export default class ViewComponent extends Component {
  constructor() {
    super();

    this.state = {
      timer: null,
      isStarted: false,
      isEnded: false,
      isPaused: false,
      interval: null,
      reset: false,
      timerInterval: 5,
      timerName: 'Timer'
    };
    this.setTimerName = this.setTimerName.bind(this);
    this.onClockPress = this.onClockPress.bind(this);
    this.onTimerToggleState = this.onTimerToggleState.bind(this);
    this.onTimerPause = this.onTimerPause.bind(this);
    this.onTimerReset = this.onTimerReset.bind(this);
    this.onTimerEnd = this.onTimerEnd.bind(this);
  }
  componentDidMount() {
    this.onTimerReset();
  }

  setTimerName( name ) {
    if ( !name ) {
      let prompt = Prompt;
      
      if ( Platform.OS === 'ios') {
        prompt = AlertIOS.prompt
      }

      prompt(
        'Enter new name',
        null,
        [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: newName => {
          if (! newName) { Alert.alert('Wrong name!'); return false; }
          this.setState({timerName: newName});
        }},
        ],
        {
            type: 'default',
            cancelable: true,
            defaultValue: '',
            placeholder: this.state.timerName
        });
    }
  }

  onTimerToggleState() {
    console.log(this.state)
    if ( this.state.isPaused ) {
      this.onTimerStart();
    }

    if ( !this.state.isStarted ) {
      this.onTimerStart();
    } else {
      this.onTimerPause();
    }
  }
  onTimerReset() {
    console.log('reset');

    this.setState({ isEnded: false, isStarted: false, reset: true, timer: null, remaining: null, interval: this.state.timerInterval, isPaused: false });
  }
  onTimerStart() {
    console.log('start');
    // this.tree.commit('timerState', 'started');
    this.setState({ isStarted: true, isPaused: false });
  }
  onTimerPause() {
    console.log('pause');
    // this.tree.commit('timerState', 'paused');
    this.setState({ isStarted: false, isPaused: true });
  }

  onTimerEnd() {
    console.log('end');
    if( Platform.os === 'ios' ) {
      Vibration.vibrate([0, 1000, 2000, 3000]);
    } else {
      Vibration.vibrate([0, 500, 200, 500]);
    }
    this.onTimerReset();
    // this.tree.commit('timerState', 'expired');
    this.setState({ isEnded: true, isStarted: false, isPaused: false });
  }

  onClockPress() {
    let prompt = Prompt;
      
    if ( this.state.isStarted && this.state.isPaused ) {
      Alert.alert('Please stop timer first');
    }
    if ( Platform.OS === 'ios') {
      prompt = AlertIOS.prompt
    }

    prompt(
      'Enter timer interval',
      null,
      [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'OK', onPress: newAmount => {
        if (parseInt(newAmount) > 10 && parseInt(newAmount) <= 3599 ) {
          this.setState({ reset: true, interval: parseInt(newAmount) });
        } else { 
          Alert.alert('Wrong value!');
        }
      }},
      ],
      {
          type: 'default',
          cancelable: true,
          defaultValue: `${this.state.interval}`,
          placeholder: `${this.state.timerInterval}`
      });
  }

  componentDidUpdate() {
    if(this.state.reset) {
      this.setState({ reset: false});
    }
  }

  render () {
    console.log('render home screen');
    return (
    <View style={styles.mainView}>
      <View style={styles.centeredView}>
        <View style={styles.clockView}>
          <SVGClock
            reset={this.state.reset}
            isStarted={this.state.isStarted}
            isPaused={this.state.isPaused}
            interval={this.state.interval}
            onPress={this.onClockPress}
            onEnd={this.onTimerEnd} />
        </View>

        <View style={{ padding: 20 }}>
          <Text onLongPress={()=>{this.setTimerName()}} style={styles.titleText}>
            {this.state.timerName}
          </Text>
        </View>

        <View style={styles.btnContainerView}>
          <View style={styles.btnVerticalContainerView}>
            <Button
              onPress={this.onTimerToggleState}
              title={ !this.state.isStarted ? "Start" : "Pause"}
              color="#F56217" />

            <View style={styles.btnSpacer} />

            <Button
              onPress={this.onTimerReset}
              disabled={!(this.state.isEnded || this.state.isPaused )}
              title={"Reset"}
              color="#e74c3c" />

            </View>
        </View>
      </View>
    </View>)
  }
}