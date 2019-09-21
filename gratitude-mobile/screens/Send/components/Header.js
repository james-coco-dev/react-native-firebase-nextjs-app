import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native'

import colors from '../../../lib/colors'

const styles = StyleSheet.create({
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  title: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center'
  },
  icon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#999999'
  }
})

const Header = (self) => {
  // if the user has selected someone to send gratitude, show close and send, otherwise show other things
  return (
    <View style={styles.headerRow}>
      {self.state.selected ? (
        <TouchableOpacity onPress={() => self.setState({ selected: null })}>
          <View>
            <Text>Close</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => self.props.navigation.navigate('Profile')}>
          <View>
            <View style={styles.icon} />
          </View>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Gratitude</Text>
      {self.state.selected ? (
        <TouchableOpacity onPress={() => self.handleSubmit(self.state.selected.phoneNumber, self.state.message, self.state.amount, self.state.sourceId)}>
          <View>
            <Text>Send</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View>
          <Text>Something?</Text>
        </View>
      )}
    </View>
  )
}

export default Header
