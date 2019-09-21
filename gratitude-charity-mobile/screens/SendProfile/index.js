import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native'
import {
  colors
} from '@corcos/lib/native'

import firebase from '../../lib/firebase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  charity: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey[800]
  },
  sendRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  amountButton: {
    margin: 5,
    padding: 5,
    backgroundColor: colors.green[400],
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 50
  },
  amountText: {
    color: 'white'
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey[800],
    marginBottom: 10
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
    color: colors.grey[800]
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.grey[500],
    marginBottom: 30
  },
  empty: {
    borderColor: colors.grey[400],
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    margin: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const amounts = [
  {
    title: '$5',
    amount: 500
  },
  {
    title: '$20',
    amount: 2000
  },
  {
    title: '$100',
    amount: 10000
  },
  {
    title: '$250',
    amount: 25000
  }
]

/**
 * This screen is used to show the profile of the person to whom you're sending
 * Gratitude. If the user to whom they would like to send money have already selected
 * charities they like, show those charities to allow the user to select from among
 * them. Otherwise, allow them to send money that the user can allocate as they see
 * fit.
 */
class SendProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      charities: [],
      loading: true
    }
  }

  static navigationOptions = {
    title: 'Send Gratitude'
  }

  componentDidMount = async () => {
    // make an api call to see if there is user data for this phone number
    try {
      const { data } = await firebase.functions().httpsCallable('getUserCharities')({
        phoneNumber: this.props.navigation.getParam('selected').phoneNumber
      })

      this.setState({
        charities: data.charities,
        loading: false
      })
    } catch (err) {
      console.error(err)
      this.setState({ loading: false })
    }
  }

  render () {
    const selected = this.props.navigation.getParam('selected')
    if (!selected || Object.keys(selected).length < 1) {
      return (
        <View>
          <Text>No user selected. Error. I'm not actually sure how you even got to this page... Start over.</Text>
        </View>
      )
    }

    // check if user exists. if so, show the charities this user likes
    // otherwise, show a "let them allocate it themselves" button
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{selected.name}'s</Text>
        <Text style={styles.subtitle}>Favorite Charities</Text>
        {this.state.loading && <View><Text>Loading...</Text></View>}
        {this.state.charities.map(c => (
          <View key={c.charityName + c.id} style={styles.charity}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{c.charityName}</Text>
            </View>
            <View style={styles.sendRow}>
              {amounts.map(a => (
                // when user selects an amount, open the payment page with the amount and destination
                // passed as params
                <TouchableOpacity key={a.title} onPress={() => this.props.navigation.navigate('SendPayment', { amount: a, charity: c, selected })}>
                  <View style={styles.amountButton}>
                    <Text style={styles.amountText}>{a.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.empty}>
          <Text style={{ marginBottom: 15 }}>Thank {selected.name} by donating money to a charity of their choice. Once they download the app, they can chose which charity to send it to.</Text>
          <View style={styles.sendRow}>
            {amounts.map(a => (
              // when user selects an amount, open the payment page with the amount and destination
              // passed as params
              <TouchableOpacity key={a.title} onPress={() => this.props.navigation.navigate('SendPayment', { amount: a, charity: null, selected })}>
                <View style={styles.amountButton}>
                  <Text style={styles.amountText}>{a.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    )
  }
}

export default SendProfile
