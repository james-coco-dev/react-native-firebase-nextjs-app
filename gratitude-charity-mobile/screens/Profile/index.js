import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'
import {
  Button,
  Data
} from '@corcos/components/native'

import Context from '../../lib/context'
import { db } from '../../lib/firebase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  charity: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5
  }
})

class Profile extends React.Component {
  render () {
    return (
      <Context.Consumer>
        {store => (
          <View style={styles.container}>
            <Text>{store.currentUser.uid}</Text>
            <Button title='Sign out' onPress={() => store.signOut()} />
            <Text style={{ fontSize: 32, paddingBottom: 15, paddingTop: 30 }}>
              Your favorite charities
            </Text>
            <ScrollView>
              <Data query={db.collection('users').doc(store.currentUser.uid).collection('charities')}>
                {({ data, loading }) => {
                  if (loading) return <View><Text>Loading...</Text></View>

                  const charities = Object.keys(data).map(key => data[key])
                  return charities.map(c => (
                    <View style={styles.charity} key={c.id}>
                      <Text>{c.charityName}</Text>
                    </View>
                  ))
                }}
              </Data>
            </ScrollView>
            <View style={{ height: 15 }} />
            <Button title='Add another charity' onPress={() => this.props.navigation.navigate('CharitySelect')} />
            <View style={{ height: 30 }} />
          </View>
        )}
      </Context.Consumer>
    )
  }
}

export default Profile
