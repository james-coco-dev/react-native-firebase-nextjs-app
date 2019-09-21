import React from 'react'
import {
  View,
  Image,
  Dimensions,
  Text,
  StyleSheet
} from 'react-native'

import {
  Button
} from '../../components'

import Context from '../../lib/context'
import colors from '../../lib/colors'

const { height } = Dimensions.get('screen')

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    height: height,
    position: 'relative',
    backgroundColor: colors.peach
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '600',
    paddingBottom: 30
  },
  subtitle: {
    color: colors.text,
    fontSize: 16
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
    paddingLeft: 30,
    paddingRight: 30
  },
  image: {
    width: undefined,
    height: undefined,
    flex: 1
  },
  textContainer: {
    paddingLeft: 30,
    paddingRight: 30
  }
})

class Home extends React.Component {
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
      <Context.Consumer>
        {store => {
          return (
            <View style={styles.container}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>Gratitude</Text>
                <Text style={styles.subtitle}>Your dreams are within reach.</Text>
              </View>
              {/* https://medium.com/the-react-native-log/tips-for-react-native-images-or-saying-goodbye-to-trial-and-error-b2baaf0a1a4d */}
              <Image resizeMode='contain' source={require('../../static/home-graphic.png')} style={styles.image} />
              <View style={styles.buttonContainer}>
                <Button title='Sign Up' onPress={() => store.toggleAuthModal('signUp')} />
                <View style={{ height: 20 }} />
                <Button title='Log In' onPress={() => store.toggleAuthModal('logIn')} />
              </View>
            </View>
          )
        }}
      </Context.Consumer>
    )
  }
}

class HomeContainer extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return (
      <Context.Consumer>
        {store => <Home store={store} {...this.props} />}
      </Context.Consumer>
    )
  }
}

export default HomeContainer
