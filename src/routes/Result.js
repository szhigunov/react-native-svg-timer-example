import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {branch} from 'baobab-react/higher-order';

class ViewComponent extends Component {

  render () {
    return (
    <View style={{ flex: 1, backgroundColor: 'transparent'}}>
      <View style={styles.centeredView}>
        <View style={{ backgroundColor: 'transparent'}}>
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 64, fontWeight: '800'}}>
            {this.props.min}:{this.props.sec}
          </Text>
        </View>
      </View>
    </View>)
  }
}

export default branch({ min: 'min', sec: 'sec'}, ViewComponent)

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});