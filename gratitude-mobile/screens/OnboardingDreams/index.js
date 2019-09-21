import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import colors from '../../lib/colors'

import Carousel from './Carousel'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.peach,
    paddingTop: 100
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '600',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 80
  }
})

class OnboardingDreams extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create a dream</Text>
        <Carousel {...this.props} />
        <View style={{ height: 150, backgroundColor: 'transparent' }} />
      </View>
    )
  }
}

export default OnboardingDreams
