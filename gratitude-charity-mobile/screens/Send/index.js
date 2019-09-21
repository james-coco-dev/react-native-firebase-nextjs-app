import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import firebase from '../../lib/firebase'

import onMount from './utils/onMount'

import Header from './components/Header'
import ContactList from './components/ContactList'
import Search from './components/Search'
// import PaymentAccessory from './components/PaymentAccessory'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60
  },
  sendContainer: {
    flex: 1,
    padding: 20
  }
})

class Send extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      phoneNumber: '',
      amount: '',
      message: '',
      search: '',
      sourceId: '',
      loading: false,
      contacts: [],
      filteredContacts: [],
      selected: null // used to determine when a contact has been selected
    }
  }

  static navigationOptions = {
    header: null
  }

  handleSubmit = async (phoneNumber, message, amount, sourceId) => {
    if (!phoneNumber || !message || !amount || !sourceId) {
      window.alert('Missing phone, message, or money.')
    } else {
      try {
        this.setState({ loading: true })
        await firebase.functions().httpsCallable('sendMoney')({
          to: { type: 'phone', value: phoneNumber },
          // convert to cents before sending
          amount: Math.round(Number(amount) * 100),
          message,
          sourceId
        })
        this.setState({ loading: false })
        window.alert('Success!')
        this.setState({ selected: null })
      } catch (err) {
        console.error(err)
        this.setState({ loading: false })
        window.alert('error', JSON.stringify(err))
      }
    }
  }

  componentDidMount () {
    onMount(this)
  }

  render () {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: 100 }}>
          <Text>Loading...</Text>
        </View>
      )
    }
    // const inputAccessoryViewID = 'GBSmIsodiDxU'
    return (
      <View style={styles.container}>
        {Header(this)}
        {Search(this)}
        {ContactList(this)}
        {/* {this.state.selected && (
          <View style={styles.sendContainer}>
            <TextInput
              ref={ref => { this.input = ref }}
              inputAccessoryViewID={inputAccessoryViewID}
              autoCorrect={false}
              placeholder='How would you like to express your gratitude?'
              onChangeText={v => this.setState({ message: v })} />
          </View>
        )} */}

        {/* <PaymentAccessory
          input={this.input}
          amount={this.state.amount}
          setSourceId={v => this.setState({ sourceId: v })}
          setAmount={v => this.setState({ amount: v })}
          inputAccessoryViewID={inputAccessoryViewID} /> */}

        {/* <SectionList
          renderSectionHeader
          renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>} /> */}
        {/* <Text>Phone Number</Text>
        <StyledTextInput value={this.state.phoneNumber} onChangeText={v => this.setState({ phoneNumber: v })} />
        <Text>Message</Text>
        <StyledTextInput value={this.state.message} onChangeText={v => this.setState({ message: v })} />
        <Button onPress={() => this.handleSubmit()} title='Send' /> */}
      </View>
    )
  }
}

export default Send
