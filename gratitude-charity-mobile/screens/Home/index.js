import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native'
import {
  colors,
  elevation
} from '@corcos/lib/native'
import {
  Data,
  Button
} from '@corcos/components/native'

import { db } from '../../lib/firebase'
import Context from '../../lib/context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%'
  },
  actionButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: colors.blue[400],
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation[1]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingLeft: 15,
    paddingBottom: 30,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    width: '100%'
  },
  transaction: {
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC'
  },
  title: {
    paddingBottom: 15,
    fontSize: 24
  }
})

const TransactionItem = (item, self) => {
  return (
    <View key={item.chargeId} style={styles.transaction}>
      <View style={{ width: '25%' }}>
        <Text>{`$${Math.round(item.amount / 100)}`}</Text>
      </View>
      <View style={{ width: '75%' }}>
        <Text>{item.description}</Text>
      </View>
    </View>
  )
}

const ActionButton = (self) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={() => self.props.navigation.navigate('Send')}>
      <View>
        <Text style={{ color: 'white' }}>Send</Text>
      </View>
    </TouchableOpacity>
  )
}

class Sent extends React.Component {
  static contextType = Context

  render () {
    return (
      <View>
        <Text style={styles.title}>My charitable giving</Text>
        {this.context.currentUser.uid && (
          <Data query={db.collection('transactions').where('sourceId', '==', this.context.currentUser.uid)}>
            {({ data, loading }) => {
              if (loading) {
                return (
                  <View>
                    <Text>Loading...</Text>
                  </View>
                )
              }
              const transactions = Object.keys(data).map(key => data[key])

              if (transactions.length < 1) {
                return (
                  <View>
                    <Text>No transactions</Text>
                  </View>
                )
              }

              return (
                <ScrollView>
                  {transactions.map(t => TransactionItem(t, this))}
                </ScrollView>
              )
            }}
          </Data>
        )}
      </View>
    )
  }
}

class Received extends React.Component {
  static contextType = Context

  render () {
    return (
      <View>
        <Text style={styles.title}>Gifts sent on your behalf</Text>
        {this.context.currentUser.uid && (
          <Data query={db.collection('transactions').where('recipientId', '==', this.context.currentUser.uid)}>
            {({ data, loading }) => {
              if (loading) {
                return (
                  <View>
                    <Text>Loading...</Text>
                  </View>
                )
              }
              const transactions = Object.keys(data).map(key => data[key])

              if (transactions.length < 1) {
                return (
                  <View>
                    <Text>No transactions</Text>
                  </View>
                )
              }

              return (
                <ScrollView>
                  {transactions.map(t => TransactionItem(t, this))}
                </ScrollView>
              )
            }}
          </Data>
        )}
      </View>
    )
  }
}

const Content = (self) => {
  if (self.state.tab === 'sent') {
    return <Sent />
  }
  if (self.state.tab === 'received') {
    return <Received />
  }
  return <View><Text>This should not render... There was an error somewhere.</Text></View>
}

/**
 * Shows transaction history of user and user's contacts?
 * TODO how to do transaction history of contacts?
 */
class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'sent' // 'sent', 'received'
    }
  }
  static navigationOptions = {
    header: null
  }

  static contextType = Context

  render () {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
            <View>
              <Text style={{ color: 'blue' }}>
                Profile
              </Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text>Gratitude</Text>
          </View>
          <View />
        </View>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingBottom: 15 }}>
            <Button style={{ width: 120 }} title='Sent' disabled={(this.state.tab === 'sent')} onPress={() => this.setState({ tab: 'sent' })} />
            <Button style={{ width: 120 }} title='Received' disabled={(this.state.tab === 'received')} onPress={() => this.setState({ tab: 'received' })} />
          </View>
          {Content(this)}
          {ActionButton(this)}
        </View>
      </>
    )
  }
}

export default Home
