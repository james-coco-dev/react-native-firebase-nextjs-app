import React from 'react'
import {
  View,
  Text,
  Button as RNButton,
  TouchableOpacity,
  Modal
} from 'react-native'
import PlaidAuthenticator from 'react-native-plaid-link'

import {
  Button,
  Input
} from '../../components'

import Context from '../../lib/context'
import { ScrollView } from 'react-native-gesture-handler';

const SelectAccount = (self, store) => {
  return (
    <View style={{ padding: 20 }}>
      <View style={{ height: 50 }} />
      <Button title='close' onPress={() => store.togglePlaidModal()} />
      <Text>{store.bankData.institution.name}</Text>
      {store.bankData.accounts.map(acct => {
        return (
          <TouchableOpacity key={acct.id}
            onPress={() => self.setState({
              accountId: acct.id,
              name: acct.name,
              type: acct.subtype,
              mask: acct.mask
            })}>
            <View style={{ padding: 20 }}>
              <Text>Name: {acct.name}</Text>
              <Text>Ending in: {acct.mask}</Text>
              <Text>Type: {acct.subtype}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const handleSubmit = async (self, store) => {
  try {
    self.setState({ loading: true })
    await self.props.firebase.functions().httpsCallable('createFundingSource')({
      publicToken: store.bankData.public_token,
      accountId: self.state.accountId,
      bank: store.bankData.institution.name,
      name: self.state.name,
      type: self.state.type,
      mask: self.state.mask,
      firstName: self.state.firstName,
      lastName: self.state.lastName,
      email: self.state.email,
      address1: self.state.address1,
      city: self.state.city,
      state: self.state.state,
      postalCode: self.state.postalCode,
      dateOfBirth: self.state.dateOfBirth,
      ssn: self.state.ssn
    })
    self.setState({ loading: false })
    window.alert('Success!')
    self.props.navigation.navigate('Send')
  } catch (err) {
    self.setState({ loading: false })
    console.error(err)
  }
}

const hasAllDetails = (self) => {
  const requiredDetails = [
    'firstName',
    'lastName',
    'email',
    'address1',
    'city',
    'state',
    'postalCode',
    'dateOfBirth',
    'ssn'
  ]

  let valid = true
  for (let i = 0; i < requiredDetails.length; i++) {
    // if we find a detail that does not exist
    if (!self.state[requiredDetails[i]]) {
      return false
    }
    // otherwise do nothing
  }

  return valid
}

const AdditionalDetails = (self, store) => {
  return (
    <ScrollView style={{ marginTop: 100, padding: 20 }}>
      <Text style={{ fontSize: 20, paddingBottom: 10 }}>Verify Identity</Text>
      <Text>We need the following information in order to verify your identity and connect your bank account.</Text>
      <RNButton title='close' onPress={store.togglePlaidModal} />
      <Input label='First Name' placeholder='Bob' onChangeText={v => self.setState({ firstName: v })} />
      <Input label='Last Name' placeholder='Smith' onChangeText={v => self.setState({ lastName: v })} />
      <Input label='Email' placeholder='bob@aol.com' onChangeText={v => self.setState({ email: v })} />
      <Input label='Address' placeholder='123 Market St' onChangeText={v => self.setState({ address1: v })} />
      <Input label='City' placeholder='San Francisco' onChangeText={v => self.setState({ city: v })} />
      <Input label='State (2-letter)' placeholder='CA' onChangeText={v => self.setState({ state: v })} />
      <Input label='Postal Code' placeholder='94104' onChangeText={v => self.setState({ postalCode: v })} />
      <Input label='Date of Birth (YYYY-MM-DD)' placeholder='1979-01-06' onChangeText={v => self.setState({ dateOfBirth: v })} />
      <Input label='Last 4 of Social' placeholder='3131' onChangeText={v => self.setState({ ssn: v })} />
      <View style={{ height: 30 }} />
      <Button disabled={!hasAllDetails(self)} onPress={() => handleSubmit(self, store)} title='Submit' />
      <View style={{ height: 50 }} />
    </ScrollView>
  )
}

class PlaidModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      accountId: null,
      firstName: '',
      lastName: '',
      email: '',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: '',
      loading: false
    }
  }

  static defaultProps = {
    onShow: () => {}
  }

  onMessage = async (response, store) => {
    // if the plaid modal says that it's closed, toggle the modal
    if (response.eventName === 'EXIT') {
      store.togglePlaidModal()
    }
    // if the event contains the "connected" type, it was successful
    if (/connected/g.test(response.action)) {
      await store.setBankData(response.metadata)
    }
  }

  render () {
    return (
      <Context.Consumer>
        {store => {
          const hasBankData = (Object.keys(store.bankData).length > 0)
          return (
            <Modal animationType='slide' visible={store.plaidModalIsOpen}>
              <View style={{ flex: 1, borderTopColor: 'grey', borderTopWidth: 1 }}>
                {!hasBankData && (
                  <>
                    <PlaidAuthenticator
                      onMessage={(response) => this.onMessage(response, store)}
                      publicKey='e94179080ff64f0db1dac7dc3affe4'
                      env='sandbox'
                      useWebKit
                      product='auth,transactions'
                      clientName='Gratitude' />
                    <View style={{ height: 20 }} />
                  </>
                )}
                {(hasBankData && !this.state.accountId) && SelectAccount(this, store)}
                {(hasBankData && this.state.accountId) && AdditionalDetails(this, store)}
              </View>
            </Modal>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default PlaidModal
