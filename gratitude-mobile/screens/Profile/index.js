import React from 'react'
import {
  View,
  StyleSheet,
  Button as RNButton,
  Text
} from 'react-native'
import {
  Data
} from '@corcos/components'

import {
  Button
} from '../../components'

import { db } from '../../lib/firebase'
import Context from '../../lib/context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingLeft: 20,
    paddingRight: 20
  },
  dream: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black'
  },
  dreamTitle: {
    fontSize: 20
  }
})

class Profile extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleDelete = async (store, dream) => {
    await db.collection('users').doc(store.currentUser.uid).collection('dreams').doc(dream.id).delete()
  }

  render () {
    return (
      <Context.Consumer>
        {store => {
          if (!store.currentUser.uid) return <Text>Loading...</Text>
          return (
            <View style={styles.container}>
              <Text>Your Profile</Text>
              <Data query={db.collection('users').doc(store.currentUser.uid).collection('dreams')}>
                {({ data: dreams, loading }) => {
                  if (loading) return <Text>Loading...</Text>
                  return Object.keys(dreams).map(key => ({ ...dreams[key], id: key })).map(dream => (
                    <View style={styles.dream}>
                      <Text style={styles.dreamTitle}>{dream.title}</Text>
                      <Text>{dream.text}</Text>
                      <RNButton title='Delete' onPress={() => this.handleDelete(store, dream)} />
                    </View>
                  ))
                }}
              </Data>
              <Button title='Sign out' onPress={() => {
                store.signOut()
                this.props.navigation.navigate('Home')
              }} />
              <Button title='back' onPress={() => this.props.navigation.goBack()} />
            </View>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default Profile
