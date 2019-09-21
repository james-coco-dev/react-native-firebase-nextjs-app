// https://material.io/design/components/sheets-bottom.html#usage
import React from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'

const styles = StyleSheet.create({
  container: (props) => ({
    height: 100,
    width: '100%',
    backgroundColor: 'red',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  })
})

class BottomSheet extends React.Component {
  render () {
    return (
      <View style={styles.container(this.props)}>
        <Text>foo</Text>
      </View>
    )
  }
}

export default BottomSheet
