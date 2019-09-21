import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native'
import Swiper from 'react-native-swiper'
import { colors } from '@corcos/lib'
import {
  Button,
  Data
} from '@corcos/components/native'

import { db } from '../../lib/firebase'
import Context from '../../lib/context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100
  },
  buttonText: {
    color: 'white',
    fontSize: 60
  },
  image: {
    width: undefined,
    height: undefined,
    flex: 1
  },
  slide1: {
    flex: 1,
    padding: 30
  },
  slide2: {
    flex: 1,
    padding: 30
  },
  slide3: {
    flex: 1,
    padding: 30
  },
  text: {
    fontSize: 24,
    color: colors.blue[500],
    lineHeight: 32
  }
})

const NextButton = () => <Text style={styles.buttonText}>›</Text>
const PreviousButton = () => <Text style={styles.buttonText}>‹</Text>

/**
 * Goes through onboarding flow to show the user how to use the app
 */
class Onboarding extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      swiperIndex: 0,
      charities: {}
    }
  }

  componentDidUpdate = (prevProps) => {
    if (Object.keys(this.props.charities).length > 0) {
      // if we get charities, redirect to homepage to see past transactions
      this.props.navigation.navigate('Home')
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Swiper
          // when the index changes to the third page, change the button to the "call to action" style
          // button, which is a darker color
          onIndexChanged={(i) => this.setState({ swiperIndex: i })}
          nextButton={<NextButton />}
          prevButton={<PreviousButton />}
          activeDotColor={colors.blue[600]}
          dotStyle={{ borderColor: colors.blue[400], borderWidth: 1, backgroundColor: 'transparent' }}
          loop={false}
          style={styles.wrapper}
          showsButtons>
          <View style={styles.slide1}>
            <Text style={styles.text}>Send your friends gratitude by funding their favorite charities.</Text>
            <Image resizeMode='contain' style={styles.image} source={require('../../static/hand-heart.png')} />
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Select your favorite charities to let your friends know what's important to you.</Text>
            <Image resizeMode='contain' style={styles.image} source={require('../../static/love-house.png')} />
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>Get started now to start the virtuous cycle of giving.</Text>
            <Image resizeMode='contain' style={styles.image} source={require('../../static/hand-cycle.png')} />
          </View>
        </Swiper>
        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Button disabled={!(this.state.swiperIndex === 2)} title='Add your favorite charity' onPress={() => this.props.navigation.navigate('CharitySelect')} />
        </View>
        <View style={{ height: 30 }} />
      </View>
    )
  }
}

const OnboardingContainer = (props) => {
  return (
    <Context.Consumer>
      {store => {
        if (!store.currentUser.uid) return <View><Text>No user error.</Text></View>

        return (
          <Data query={db.collection('users').doc(store.currentUser.uid).collection('charities')}>
            {({ data: charities = {}, loading }) => (
              <Onboarding {...props} charities={charities} />
            )}
          </Data>
        )
      }}
    </Context.Consumer>
  )
}

OnboardingContainer.navigationOptions = {
  header: null
}

export default OnboardingContainer
