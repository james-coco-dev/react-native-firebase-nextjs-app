import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import colors from '../../lib/colors'

const styles = StyleSheet.create({
  button: (props) => ({
    backgroundColor: props.disabled ? '#CCCCCC' : colors.salmon,
    borderRadius: 5,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})

class Button extends React.Component {
  static defaultProps = {
    onPress: () => {},
    style: {},
    title: 'Submit'
  }

  render () {
    return (
      <TouchableOpacity disabled={this.props.disabled} onPress={() => this.props.onPress()}>
        <View style={{ ...styles.button(this.props), ...this.props.style }}>
          <Text style={styles.text}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default Button
