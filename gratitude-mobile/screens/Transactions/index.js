import React from 'react'
import {
  View,
  ScrollView,
  Text
} from 'react-native'
import {
  Data
} from '@corcos/components/native'

import firebase from '../../lib/firebase'
import Context from '../../lib/context'

const db = firebase.firestore()

class Transactions extends React.Component {
  render () {
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Context.Consumer>
            {store => {
              if (!store.currentUser.uid) return null
              return (
                <View>
                  <Data query={db.collection('transactions').where('sourceId', '==', store.currentUser.uid)}>
                    {({ data: sent, loading }) => {
                      return (
                        <View>
                          <Text>You Sent:</Text>
                          {Object.keys(sent).map(key => sent[key]).map(t => (
                            <View key={t.id} style={{ padding: 20 }}>
                              <Text>Amount: ${Math.round(t.amount / 100)}</Text>
                              <Text>To: {t.recipientId}</Text>
                              <Text>Message: {t.message}</Text>
                              <Text>{JSON.stringify(t)}</Text>
                            </View>
                          ))}
                        </View>
                      )
                    }}
                  </Data>
                  <Data query={db.collection('transactions').where('recipientId', '==', store.currentUser.uid)}>
                    {({ data: received, loading }) => {
                      return (
                        <View>
                          <Text>You Received:</Text>
                          {Object.keys(received).map(key => received[key]).map(t => (
                            <View key={t.id} style={{ padding: 20 }}>
                              <Text>{JSON.stringify(t)}</Text>
                            </View>
                          ))}
                        </View>
                      )
                    }}
                  </Data>
                </View>
              )
            }}
          </Context.Consumer>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    )
  }
}

export default Transactions
