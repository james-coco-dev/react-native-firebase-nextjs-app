import React from 'react'
import {
  StyleSheet,
  SectionList,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native'

import colors from '../../../lib/colors'

const styles = StyleSheet.create({
  contactContainer: {
    paddingLeft: 15,
    paddingRight: 15
  },
  contact: {
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1
  },
  section: {
    backgroundColor: colors.peach,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 15
  },
  sectionTitle: {
    color: colors.salmon,
    fontWeight: '600'
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 5
  },
  phoneNumber: {
    fontSize: 16,
    color: '#999999'
  }
})

const ListItem = (item, key, self) => (
  <TouchableOpacity key={key} onPress={() => self.setState({ selected: item })}>
    <View style={styles.contactContainer}>
      <View style={styles.contact}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
      </View>
    </View>
  </TouchableOpacity>
)

const ContactList = (self) => {
  // only render this component if nothing has been selected and there are contacts to display
  if (self.state.contacts.length < 1) {
    return (
      <Text>No contacts to display</Text>
    )
  }
  // render nothing if someone is selected
  if (self.state.selected) return null

  // if there is a filtered list, show that instead of the section list
  if (self.state.filteredContacts.length > 0) {
    return (
      <FlatList
        renderItem={({ item }) => ListItem(item, `${item.name}-${item.phoneNumber}`, self)}
        data={self.state.filteredContacts} />
    )
  }

  return (
    <SectionList
      // if there are filtered contacts, show them, otherwise show normal contacts
      sections={self.state.contacts}
      renderItem={({ item, index, section }) => ListItem(item, `${index}-${item.name}-${item.phoneNumber}`, self)}
      renderSectionHeader={({ section: { title } }) => (
        <View key={`${title}-section`} style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )} />
  )
}

export default ContactList
