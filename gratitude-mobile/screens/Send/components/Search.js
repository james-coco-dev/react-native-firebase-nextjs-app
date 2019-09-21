import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput
} from 'react-native'
import Fuse from 'fuse.js'

import colors from '../../../lib/colors'

const styles = StyleSheet.create({
  search: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedName: {
    paddingLeft: 15,
    fontWeight: '600',
    fontSize: 18
  },
  to: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.text,
    paddingLeft: 20
  },
  amount: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15
  },
  amountInput: {
    minWidth: 20
  },
  searchInput: {
    width: '100%',
    height: 50,
    paddingLeft: 15,
    paddingTop: 3
  }
})

var options = {
  keys: [{
    name: 'name',
    weight: 0.7
  }, {
    name: 'phoneNumber',
    weight: 0.3
  }]
}

const handleChange = (t, self, fuse) => {
  self.setState({ search: t })
  const v = fuse.search(t)
  self.setState({ filteredContacts: v })
}

const Search = (self) => {
  // transform contacts into a flat list for fusejs
  const flatContacts = self.state.contacts.reduce((acc, section) => {
    return [...acc, ...section.data]
  }, [])
  const fuse = new Fuse(flatContacts, options)
  return (
    <View style={styles.search}>
      <Text style={styles.to}>To:</Text>
      {!self.state.selected && <TextInput placeholder='Name or Phone Number' value={self.state.search} style={styles.searchInput} onChangeText={t => handleChange(t, self, fuse)} />}
      {self.state.selected && <Text style={styles.selectedName}>{self.state.selected.name}</Text>}
      {/* {self.state.selected && (
        <View style={styles.amount}>
          <Text>$</Text>
          <TextInput placeholder='0' style={styles.amountInput} onChangeText={v => self.setState({ amount: v })} />
        </View>
      )} */}
    </View>
  )
}

export default Search
