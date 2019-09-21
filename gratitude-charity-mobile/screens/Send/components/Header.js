import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native'
import {
  colors
} from '@corcos/lib'

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
    color: colors.blue[500],
    textAlign: 'center'
  },
  icon: {
    height: 30,
    backgroundColor: '#999999'
  }
})

const Header = (self) => {
  // if the user has selected someone to send gratitude, show close and send, otherwise show other things
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => self.props.navigation.navigate('Home')}>
        <View>
          <Text>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => self.props.navigation.navigate('Home')}>
        <Text style={styles.title}>Gratitude</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => self.props.navigation.navigate('Profile')}>
        <View style={styles.icon}>
          <Text>Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Header
