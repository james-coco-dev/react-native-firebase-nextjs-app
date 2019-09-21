const functions = require('firebase-functions')
const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

const { authenticate } = require('../../lib/auth')
const { firebase } = require('../../lib/firebase')
// const { sendSMS } = require('../../lib/sendSMS')

/**
 * Allows a user to log in with just a phone number.
 */
const logInWithPhoneNumber = functions.https.onCall(async (data, context) => {
  let { phoneNumber, phoneVerification } = data

  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'US')

  // check that phone verification worked. otherwise throw
  try {
    const national = phoneUtil.format(number, PNF.NATIONAL)
    const countryCode = number.getCountryCode()

    const res = await authenticate(national, countryCode, phoneVerification)
    console.info(res)
  } catch (err) {
    console.error(err)
    if (err) return err
  }
  // if it passes authentication, continue

  // overwrite phone number with google libphonenumber's best guess as to the number
  phoneNumber = phoneUtil.format(number, PNF.E164)

  let account
  try {
    account = await firebase.auth().getUserByPhoneNumber(phoneNumber)
  } catch (err) {
    // if the error is anything other than "not found", log the error. We want to ignore
    // not found errors because it is very often the case that there is no user, which is
    // expected behavior
    if (err) return err
  }
  // if the account is found with that phone number, generate token

  let token
  try {
    token = await firebase.auth().createCustomToken(account.uid)
  } catch (err) {
    console.error(err)
  }

  return {
    token
  }
})

module.exports = {
  logInWithPhoneNumber
}
