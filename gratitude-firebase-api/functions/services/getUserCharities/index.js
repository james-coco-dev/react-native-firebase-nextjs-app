const functions = require('firebase-functions')
const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

const { firebase, dbRest } = require('../../lib/firebase')

const getUserCharities = functions.https.onCall(async (data, context) => {
  const { phoneNumber } = data

  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'US')
  const formattedPhoneNumber = phoneUtil.format(number, PNF.E164)

  // check to see if there is a recipient with this phone number
  let recipient
  try {
    recipient = await firebase.auth().getUserByPhoneNumber(formattedPhoneNumber)
  } catch (err) {
    // squelch not-found errors, as they are expected
    if (err.code !== 'auth/user-not-found') {
      console.error(err)
    }
  }

  // if someone already exists, return their charities
  if (recipient && recipient.uid) {
    try {
      const charities = []
      const query = await dbRest.collection('users').doc(recipient.uid).collection('charities').get()
      query.forEach(c => {
        charities.push({ ...c.data(), id: c.id })
      })

      return {
        charities
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    charities: []
  }
})

module.exports = {
  getUserCharities
}
