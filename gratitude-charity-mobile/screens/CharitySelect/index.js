import React from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native'
import debounce from 'lodash.debounce'
import {
  Input
} from '@corcos/components/native'
import {
  colors
} from '@corcos/lib/native'

import { db } from '../../lib/firebase'
import Context from '../../lib/context'

const charityNavigatorUrl = (query) => `https://api.data.charitynavigator.org/v2/organizations?app_key=96e800992bb5dd1bc37d78ebea8aaecd&app_id=ecec217f&search=${query}&searchType=NAME_ONLY&sort=RELEVANCE:DESC&pageSize=10`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.grey[300],
    borderRadius: 5,
    margin: 5,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
    color: colors.blue[400]
  },
  image: {
    height: undefined,
    width: undefined,
    flex: 1
  }
})

const runQuery = debounce(async (v, self) => {
  self.setState({ loading: true })
  let organizations
  try {
    const response = await window.fetch(charityNavigatorUrl(encodeURIComponent(v)))
    const result = await response.json()
    if (result.length) {
      organizations = result
    } else {
      organizations = []
    }
  } catch (err) {
    console.error(err)
    self.setState({ loading: false })
  }
  self.setState({
    organizations,
    loading: false
  })
}, 250)

class CharitySelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: '',
      organizations: [],
      loading: false
    }
  }

  static contextType = Context

  static navigationOptions = {
    header: null
  }

  handleChange = (v) => {
    this.setState({ query: v })
    runQuery(v, this)
  }

  handleSelect = async (o) => {
    try {
      // index the organization by `ein`, which is the string-version of the company EIN which
      // will necessarily be unique to each organization and will prevent duplicates
      await db.collection('users').doc(this.context.currentUser.uid).collection('charities').doc(o.ein).set({
        ...o
      }, { merge: true })
      this.props.navigation.navigate('Send')
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add your favorite charities</Text>
        <Input value={this.state.query} onChangeText={v => this.handleChange(v)} />
        <View style={{ height: 15 }} />
        {this.state.loading && (
          <View>
            <Text>Loading...</Text>
          </View>
        )}
        {this.state.organizations.length < 1 && (
          <View style={{ width: '100%', alignItems: 'center', flex: 1, height: 1000 }}>
            <View style={{ width: '50%', height: 200 }}>
              <Image resizeMode='contain' style={styles.image} source={require('../../static/love-house.png')} />
              <Text style={{ textAlign: 'center' }}>Search for a charity above.</Text>
            </View>
          </View>
        )}
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
          {this.state.organizations.map(o => {
            return (
              <TouchableOpacity onPress={() => this.handleSelect(o)} key={o.charityName + o.ein}>
                <View style={styles.card}>
                  <Text>{o.charityName}</Text>
                  <Text>State: {o.mailingAddress.stateOrProvince}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <View style={{ height: 15 }} />
      </View>
    )
  }
}

export default CharitySelect
