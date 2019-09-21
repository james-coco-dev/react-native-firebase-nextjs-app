import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  InputAccessoryView
} from 'react-native'
import {
  Data
} from '@corcos/components'
import Colors from '@corcos/lib/dist/colors'

import {
  Button
} from '../../../components'

import Context from '../../../lib/context'
import { db } from '../../../lib/firebase'

const styles = StyleSheet.create({
  inputAccessoryContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    flexDirection: 'column',
    width: '100%'
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  moneyButton: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.green[500],
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontSize: 48
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  sendMoney: (state) => ({
    height: state.sendMoney ? 140 : 0,
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  }),
  titleRow: {
    marginBottom: 5
  },
  add: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderStyle: 'dashed',
    padding: 10,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  plus: {
    color: '#BBBBBB'
  }
})

class PaymentAccessory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sendMoney: false
    }
  }

  handleMoneyButton = (source, store) => {
    // if there is no source, toggle the plaid modal and get the users bank information
    if (!source) {
      // unselect the text input
      if (this.props.input) {
        this.props.input.blur()
      }
      // handle the bank account
      window.setTimeout(() => {
        // wait 300ms so the keyboard can close first
        store.togglePlaidModal()
      }, 300)
    } else if (!this.state.sendMoney) {
      // otherwise, open the "send money" section
      this.setState({
        sendMoney: true
      })
      // and focus on the money input
      this.moneyInput.focus()
    } else {
      this.setState({
        sendMoney: false
      })
      this.props.setAmount({ amount: '0' })
      this.moneyInput.blur()
    }
  }

  handleAttach = (id) => {
    // when the user attaches an amount to the transaction, blur the input
    // set the sourceId (the payment source) to the state so we can submit it
    // and close the "send money" portion of the accessory
    this.moneyInput.blur()
    this.props.setSourceId(id)
    this.setState({ sendMoney: false })
  }

  render () {
    return (
      <Context.Consumer>
        {store => {
          if (!store.currentUser.uid) return <Text>Loading...</Text>
          return (
            <Data query={db.collection('users').doc(store.currentUser.uid).collection('fundingSources')}>
              {({ data: sources, loading }) => {
                // at the moment we only allow one funding source
                const source = Object.keys(sources).map(key => ({ ...sources[key], id: key }))[0]
                return (
                  <InputAccessoryView nativeID={this.props.inputAccessoryViewID}>
                    <View style={styles.inputAccessoryContainer}>
                      <View style={styles.titleRow}>
                        <Text>Add an attachment</Text>
                      </View>
                      <View style={styles.topRow}>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity onPress={() => this.handleMoneyButton(source, store)}>
                            <View style={styles.moneyButton}>
                              <Text style={{ color: 'white', fontSize: 18 }}>$</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {}}>
                            <View style={styles.add}>
                              <Text style={styles.plus}>+</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        {// if there is value being sent and the user is not editing the amount being sent, show
                          !!this.props.amount && !this.state.sendMoney && (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <Text>Sending: ${this.props.amount}</Text>
                            </View>
                          )}
                        {!!source && (
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{source.bank}</Text>
                            <Text>••{source.mask}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.sendMoney(this.state)}>
                        {/* <Input value={this.props.amount} onChangeText={v => this.props.setAmount(v)} /> */}
                        <View style={styles.moneyContainer}>
                          <Text>$</Text>
                          <TextInput
                            ref={ref => { this.moneyInput = ref }}
                            placeholder='0'
                            style={styles.input}
                            autoCorrect={false}
                            value={this.props.amount}
                            onChangeText={v => this.props.setAmount(v)} />
                        </View>
                        <Button title='Attach' onPress={() => this.handleAttach(source.id)} />
                      </View>
                    </View>
                  </InputAccessoryView>
                )
              }}
            </Data>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default PaymentAccessory
