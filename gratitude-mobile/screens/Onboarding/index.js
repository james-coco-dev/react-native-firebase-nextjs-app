import React from 'react'
import {
  View,
  Text,
  Button as RNButton,
  StyleSheet
} from 'react-native'

import {
  Data
} from '@corcos/components'

import firebase, { db } from '../../lib/firebase'
import colors from '../../lib/colors'
import Context from '../../lib/context'

import {
  Button
} from '../../components'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: colors.peach,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30
  },
  title: {
    fontSize: 32,
    color: colors.text,
    paddingBottom: 15,
    fontWeight: '600'
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    paddingBottom: 80
  },
  subtitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class Onboarding extends React.Component {
  componentDidMount () {
    // if this user already has a dream, redirect to Send and skip onboarding
    if (this.props.hasDream) {
      // this.props.navigation.navigate('Send')
    }
    firebase.functions().httpsCallable('productSearch')({
      query: 'harry potter'
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <Context.Consumer>
          {store => {
            return (
              <Data query={db.collection('users').doc(store.currentUser.uid)}>
                {({ data: user, loading }) => {
                  if (loading) return <Text>Loading</Text>
                  return <Text style={styles.title}>Hey {(user.fullName && user.fullName.split(' ')[0]) || 'there'}</Text>
                }}
              </Data>
            )
          }}
        </Context.Consumer>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>To get you started, let’s walk through how you can express your gratitude towards someone when you’re feeling thankful!</Text>
        </View>
        <Button title='Create my first dream' onPress={() => this.props.navigation.navigate('OnboardingDreams')} />
        <RNButton title='Skip' onPress={() => this.props.navigation.navigate('Send')} />
      </View>
    )
  }
}

// if the user is already logged in and already has at least one dream, jump ahead
class OnboardingWrapper extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return (
      <Context.Consumer>
        {store => {
          if (!store.currentUser.uid) return <Text>Loading...</Text>
          return (
            <Data query={db.collection('users').doc(store.currentUser.uid).collection('dreams')}>
              {({ data: dreams, loading }) => {
                if (loading) return <Text>Loading...</Text>
                return (
                  <Onboarding hasDream={Object.keys(dreams).length > 0} {...this.props} />
                )
              }}
            </Data>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default OnboardingWrapper
