import React from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'

import {
  Button
} from '../../components'

import colors from '../../lib/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.peach,
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30
  },
  title: {
    fontSize: 32,
    color: colors.text,
    fontWeight: '600',
    paddingBottom: 15
  },
  subtitle: {
    fontSize: 16,
    color: colors.text
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24
  }
})

class OnboardingSuccess extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You did it!</Text>
        <Text style={styles.subtitle}>You created your first dream!</Text>
        <View style={styles.bodyContainer}>
          <Text style={styles.body}>You can always create more by editing your profile in your account settings. Now let’s start by sending some Gratitude!</Text>
        </View>
        <Button onPress={() => this.props.navigation.navigate('Send')} title='Send Gratitude' />
      </View>
    )
  }
}

export default OnboardingSuccess
