import React, { Component } from 'react';
import { View, Image, StyleSheet, BackAndroid, ToastAndroid, Platform } from 'react-native';
import { Actions, ActionConst, Scene, Router} from 'react-native-router-flux';
import Routes from './routes';

import NavigationDrawer from './menu';
import AppStyles from './styles/App';

import Baobab from 'baobab';
import {root} from 'baobab-react/higher-order';
const image = require('./bg.jpeg');

// define this based on the styles/dimensions you use
const getSceneStyle = ( props, computedProps) => {
  const style = styles.getSceneStyle;
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};


class App extends Component {
  constructor() {
    super();

    this.state = { backButtonPressed: 0 };

    this.handleBackAndroid = this.handleBackAndroid.bind(this);
    this.backBtnCounter = this.backBtnCounter.bind(this);
    this.backBtnTapTimer = this.backBtnTapTimer.bind(this);
  }
  backBtnTapTimer() {
    if (this.state.backButtonPressed === 2) {
      BackAndroid.exitApp();
    } else {
      this.setState({ backButtonPressed: 0});
    }
  }

  backBtnCounter() {
    const backBtnPressed = this.state.backButtonPressed;
    const presses = backBtnPressed + 1;

    if (presses === 1) { ToastAndroid.show('Tap Back button twice to close', ToastAndroid.SHORT) }

    this.setState({ backButtonPressed: presses });

    setTimeout(this.backBtnTapTimer, 500);
  }

  handleBackAndroid() {
    try {
      Actions.pop();
      return true;
    } catch (err) {
      alert("back")
      this.backBtnCounter();
      return true;
    }
  }

  render() {
    return (
        <View style={styles.appWrapperView}>
          <Image source={image} style={styles.container}>
          
            <Router
              backAndroidHandler={() => this.handleBackAndroid()}
              panHandlers={ ( Platform.OS === 'ios' ) ? undefined : null }
              getSceneStyle={getSceneStyle}>
              <Scene key="root" unmountScenes>
                <Scene key="drawer" type={ActionConst.REPLACE} component={NavigationDrawer} tabs open={false}>
                  <Scene key="main" tabs>
                    <Scene key="home" type={ActionConst.JUMP} tabs={false} component={Routes.Home} title="Home" />
                    <Scene key="result" type={ActionConst.JUMP} tabs={false} component={Routes.Result} title="Result" />
                  </Scene>
                </Scene>
              </Scene>
            </Router>
          </Image>
        </View>)
  }
}

const styles = StyleSheet.create(AppStyles);

export default root(new Baobab({ min: '00', sec: '00' }), App);