import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native'
import {
  Button
} from '@corcos/components/native'
import {
  colors
} from '@corcos/lib'

import Context from '../../lib/context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100
  },
  title: {
    fontSize: 48,
    color: colors.blue[500],
    textAlign: 'center'
  },
  subtitle: {
    paddingTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: colors.grey[500]
  },
  image: {
    width: undefined,
    height: undefined,
    flex: 1
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30
  }
})

/**
 * Shows initial signup or login options for the app if the user is not already signed in.
 * Otherwise it redirects to onboarding
 */
class Landing extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount () {
    if (this.props.store.currentUser.uid) {
      // if the user is already signed in, send to onboarding
      this.props.navigation.navigate('Onboarding')
    }
  }

  componentDidUpdate () {
    if (this.props.store.currentUser.uid) {
      // if the user is already signed in, send to onboarding
      this.props.navigation.navigate('Onboarding')
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gratitude</Text>
        <Text style={styles.subtitle}>Show your gratitude through charity</Text>
        <Image style={styles.image} resizeMode='contain' source={require('../../static/charity-icon.png')} />
        <View style={styles.buttonContainer}>
          <Button onPress={() => this.props.store.toggleAuthModal('signUp')} title='Sign up' />
          <View style={{ height: 15 }} />
          <Button onPress={() => this.props.store.toggleAuthModal('logIn')} title='Log in' />
        </View>
      </View>
    )
  }
}

class LandingContainer extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return (
      <Context.Consumer>
        {store => <Landing store={store} {...this.props} />}
      </Context.Consumer>
    )
  }
}

export default LandingContainer
