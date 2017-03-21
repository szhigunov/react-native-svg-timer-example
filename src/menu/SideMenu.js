import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class ViewComponent extends Component {
  render () {
    return (<View style={styles.sideMenuMain}>
      <View style={{ paddingLeft: 20, paddingTop: 20, paddingRight: 40 }} >
        <View style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 20, backgroundColor: this.props.active == 'home' ? 'white' : 'transparent'}} >
          <TouchableOpacity
            disabled={this.props.active == 'home'}
            onPress={ () => { this.props.onClick('home'); }}>
            <Text style={{ fontSize: 36, color: this.props.active !== 'home' ? '#fff' : '#000', textAlign: 'left'}}>Home</Text>
            </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 20, backgroundColor: this.props.active == 'result' ? 'white' : 'transparent'}} >
          <TouchableOpacity
            disabled={this.props.active == 'result'}
            onPress={ () => { this.props.onClick('result'); }}>
            <Text style={{ fontSize: 36, color: this.props.active !== 'result' ? '#fff' : '#000', textAlign: 'left'}}>Result</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>)
  }
}

const styles = {
  sideMenuMain: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: 'rgba(0,0,0,0.33)'
  }
}