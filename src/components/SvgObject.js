import React, { Component } from 'react';

import Svg, {
    Circle,
    G,
    RadialGradient,
    Text,
    Defs,
    Stop
} from 'react-native-svg';


export default class SvgObject extends Component {
  static propTypes = {
    min: React.PropTypes.string,
    sec: React.PropTypes.string,
    offset: React.PropTypes.number,
    onPress: React.PropTypes.func,
  }

  render() {
    const { offset, min, sec, onPress} = this.props;
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
          onPressIn={() => onPress()}
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
      </Svg>
    );
  }
}