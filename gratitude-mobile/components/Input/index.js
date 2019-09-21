import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput
} from 'react-native'
import { colors } from '@corcos/lib'

const styles = StyleSheet.create({
  container: {

  },
  label: {

  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey[200],
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 3,
    paddingLeft: 20,
    fontSize: 16
  }
})

class Input extends React.Component {
  static defaultProps = {
    label: '',
    onChangeText: () => {},
    secureTextEntry: false
  }

  render () {
    return (
      <View style={styles.container}>
        {!!this.props.label && <Text style={styles.label}>{this.props.label}</Text>}
        <TextInput placeholder={this.props.placeholder} value={this.props.value} secureTextEntry={this.props.secureTextEntry} style={styles.input} onChangeText={v => this.props.onChangeText(v)} />
      </View>
    )
  }
}

export default Input
