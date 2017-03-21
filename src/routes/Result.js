import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {branch} from 'baobab-react/higher-order';
import styles from '../styles/Result.js';


class ViewComponent extends Component {
  static propTypes = {
    min: React.PropTypes.string,
    sec: React.PropTypes.string,
  }

  render () {
    return (
    <View style={styles.mainContainerView}>
      <View style={styles.centeredView}>
        <View style={styles.transparentBgView}>
          <Text style={styles.timeContainerView}>
            {this.props.min}:{this.props.sec}
          </Text>
        </View>
      </View>
    </View>)
  }
}

export default branch({ min: 'min', sec: 'sec'}, ViewComponent);