import Contacts from 'react-native-contacts'

// runs when component mounts
const onMount = (self) => {
  // gets all contacts from the users contact book
  // https://github.com/rt2zz/react-native-contacts/issues/327#issuecomment-450298936
  Contacts.getAll((err, contacts) => {
    console.log(contacts)
    if (err) console.error(err)

    // at this point, we have an array of objects in this shape:
    /* {
      birthday: {day: 15, month: 5, year: 1998}
      company: ""
      emailAddresses: []
      familyName: "Taylor"
      givenName: "David"
      hasThumbnail: false
      jobTitle: ""
      middleName: ""
      note: "Plays on Cole's Little League Baseball Team↵"
      phoneNumbers: [{
        label: 'mobile',
        number: '123-123-1234'
      }]
      postalAddresses: [{…}]
      recordID: "E94CD15C-7964-4A9B-8AC4-10D7CFB791FD"
      thumbnailPath: ""
      urlAddresses: []
    } */

    // now we need to format these contacts into section format:
    /*
      sections={[
        {title: 'Title1', data: ['item1', 'item2']},
        {title: 'Title2', data: ['item3', 'item4']},
        {title: 'Title3', data: ['item5', 'item6']},
      ]}
    */

    else {
      // create a section by name for each phone number (can be more than one per contact)
      const memo = contacts.reduce((acc, c) => {
        // if the contact does not have a last name, ignore it
        if (!c.familyName) return acc
        // if there are no phone numbers
        if (!c.phoneNumbers || c.phoneNumbers.length < 1) return acc
        const section = c.familyName[0].toUpperCase()
        return {
          ...acc,
          [section]: [
            ...(acc[section] || []),
            // TODO this can also be expanded to include unique identifiers for email
            ...c.phoneNumbers.map(p => ({ name: `${c.givenName} ${c.familyName}`, phoneNumber: p.number }))
          ]
        }
      }, {})

      const sections = Object.keys(memo).map(key => ({
        title: key,
        data: memo[key]
      }))
      self.setState({ contacts: sections })
    }
  })
}

export default onMount
