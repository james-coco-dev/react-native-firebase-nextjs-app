import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native'
import {
  Button
} from '@corcos/components/native'
import stripe from 'tipsi-stripe'

import firebase from '../../lib/firebase'

stripe.setOptions({
  publishableKey: (process.env.NODE_ENV === 'development') ? 'pk_test_beNvDj4WkGfMUdxzQtfGQv8o' : 'pk_live_W9VXk4joCm8MwWldfgq36Ah6',
  merchantId: 'merchant.com.gratitude.stripe',
  androidPayMode: 'test'
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    alignItems: 'center'
  },
  amount: {
    fontSize: 36,
    paddingBottom: 15
  },
  charity: {
    fontSize: 24,
    paddingBottom: 30
  },
  navigation: (state) => ({
    display: state.loading ? 'none' : 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15
  })
})

const processPayment = async (token, self) => {
  self.setState({ loading: true })
  const description = `${self.charity.charityName} via Gratitude`
  try {
    const response = await firebase.functions().httpsCallable('donateWithApplePay')({
      token,
      amount: self.amount.amount,
      description,
      charity: self.charity,
      sentOnBehalfOf: self.selected
    })
    console.log(response)
    await stripe.completeNativePayRequest()
    await self.setState({ loading: false })
    self.props.navigation.navigate('SendSuccess', { response: response.data })
  } catch (err) {
    console.error(err)
    await stripe.cancelNativePayRequest()
    await self.setState({ loading: false })
  }
}

/**
 * Allows the user to select their pament method
 */
class SendPayment extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      status: null,
      token: null
    }
  }

  static navigationOptions = {
    header: null
  }

  handleApplePayPress = async () => {
    const valueString = `${(Number(this.amount.amount) / 100).toFixed(2)}`
    try {
      this.setState({
        loading: true,
        status: null,
        token: null
      })
      const token = await stripe.paymentRequestWithNativePay({},
        [{
          label: `${this.charity.charityName} via Gratitude`,
          amount: valueString
        }]
      )

      this.setState({ loading: false, token })

      try {
        await processPayment(token, this)
      } catch (err) {
        console.error(err)
      }
    } catch (error) {
      this.setState({ loading: false, status: `Error: ${error.message}` })
    }
  }

  handleCreditCardPress = async () => {
    try {
      const token = await stripe.paymentRequestWithCardForm({})
      console.log(token.tokenId)
      try {
        await processPayment(token, this)
      } catch (err) {
        console.error(err)
      }
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    this.amount = this.props.navigation.getParam('amount')
    this.charity = this.props.navigation.getParam('charity')
    this.selected = this.props.navigation.getParam('selected')

    // if the user did not select a charity and is instead sending it to a charity of 
    // the selected user's choice
    if (!this.charity) {
      this.charity = {
        name: 'Charitable Trust',
        trust: true
      }
    }

    if (this.state.loading) {
      return (
        <View style={{ paddingTop: 100 }}>
          <Text>Submitting...</Text>
        </View>
      )
    }

    return (
      <>
        <View style={styles.navigation(this.state)}>
          <TouchableOpacity style={{ width: '33%' }} onPress={() => this.props.navigation.goBack()}>
            <View>
              <Text style={{ color: 'blue' }}>Go Back</Text>
            </View>
          </TouchableOpacity>
          <View style={{ width: '33%' }}>
            <Text style={{ textAlign: 'center' }}>Gratitude</Text>
          </View>
          <View style={{ width: '33%' }} />
        </View>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.amount}>{this.amount.title}</Text>
            <Text style={styles.charity}>{this.charity.charityName || `To your ${this.selected.name}'s charity of choice`}</Text>
          </View>

          {!!this.state.status && <Text>Status: {this.state.status}</Text>}

          <View>
            <Button title='Apple Pay' onPress={() => this.handleApplePayPress()} />
            <View style={{ height: 15 }} />
            <Button title='Credit Card' onPress={() => this.handleCreditCardPress()} />
            {/* <Text>PayPal (TODO)</Text>
            <Text>Bank account (TODO)</Text> */}
          </View>
        </View>
      </>
    )
  }
}

export default SendPayment
