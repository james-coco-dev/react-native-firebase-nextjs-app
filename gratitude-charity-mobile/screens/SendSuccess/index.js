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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100
  },
  title: {
    fontSize: 42,
    paddingBottom: 30
  },
  amount: {
    fontSize: 32,
    paddingBottom: 15
  },
  charity: {
    fontSize: 24
  },
  image: {
    width: undefined,
    height: undefined,
    flex: 1
  }
})

class SendSuccess extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    const response = this.props.navigation.getParam('response')

    const {
      amount,
      description
    } = response

    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Nice!</Text>
          <View style={{ width: '50%', height: 200 }}>
            <Image resizeMode='contain' style={styles.image} source={require('../../static/hand-cycle.png')} />
          </View>
          <Text style={styles.amount}>You sent: ${Math.round(amount / 100)}</Text>
          <Text style={styles.charity}>To: {description}</Text>
        </View>

        <View style={{ flex: 1 }} />

        <Button style={{ width: '100%' }} title='Go Home' onPress={() => this.props.navigation.navigate('Home')} />
        <View style={{ height: 30 }} />
      </View>
    )
  }
}

export default SendSuccess
