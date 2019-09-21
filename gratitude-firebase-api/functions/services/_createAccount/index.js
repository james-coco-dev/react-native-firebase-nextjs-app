const functions = require('firebase-functions')
const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

const { authenticate } = require('../../lib/auth')
const { firebase, dbRest } = require('../../lib/firebase')
// const { sendSMS } = require('../../lib/sendSMS')

const getUsernameWithIncrement = async (usernameBase, count = 0) => {
  let user
  try {
    user = await dbRest.collection('users').where('username', '==', `${usernameBase}${count > 0 ? count : ''}`).get()
  } catch (err) {
    console.error(err)
  }
  if (user) {
    await getUsernameWithIncrement(usernameBase, (count + 1))
  } else {
    return `${usernameBase}${count}`
  }
}

/**
 * Before a new account is created, we need to check to see if any placeholder
 * accounts have been created that use this accounts information. This would happen
 * if someone sent money to a phone number before that phone number had an account.
 *
 * If there is no placeholder account that matches the values from the client, then we
 * need to create an account for that user with the information given
 */
const createAccount = functions.https.onCall(async (data, context) => {
  let { phoneNumber, phoneVerification, fullName } = data

  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'US')

  // this converts a name like "Sam Corcos" to "scorcos"
  const usernameBase = fullName.split(' ').reduce((acc, v, i) => {
    if (i === 0) return v[0]
    return acc + v
  }, '').toLowerCase()

  console.log('usernameBase', usernameBase)

  const username = await getUsernameWithIncrement(usernameBase)
  console.log('username', username)

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

  // overwrite phone number with google libphonenumber's best guess as to the number
  phoneNumber = phoneUtil.format(number, PNF.E164)

  let account
  try {
    account = await firebase.auth().getUserByPhoneNumber(phoneNumber)
  } catch (err) {
    // if the error is anything other than "not found", log the error. We want to ignore
    // not found errors because it is very often the case that there is no user, which is
    // expected behavior
    if (err.code !== 'auth/user-not-found') {
      console.error(err)
    }
  }

  // if a placeholder account was found that matches the user's phone number, we need
  // to update the placeholder account to inclue that information
  if (account) {
    // https://firebase.google.com/docs/auth/admin/manage-users#update_a_user
    // update user
    try {
      await firebase.auth().updateUser(account.uid, {
        phoneNumber
      })
      // also update database to keep in sync
      await dbRest.collection('users').doc(account.uid).set({
        phoneNumber,
        fullName,
        username
      }, { merge: true })
    } catch (err) {
      console.error(err)
    }

    let token
    try {
      token = await firebase.auth().createCustomToken(account.uid)
    } catch (err) {
      console.error(err)
    }
    return {
      token
    }
  }

  try {
    // if there is no placeholder, just create the account
    account = await firebase.auth().createUser({
      phoneNumber
    })
    // also update database to keep in sync
    await dbRest.collection('users').doc(account.uid).set({
      phoneNumber,
      fullName,
      username
    }, { merge: true })
  } catch (err) {
    console.error(err)
  }

  // create a custom token and respond with that token so that the user can log in using that token
  // https://firebase.google.com/docs/auth/admin/create-custom-tokens
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
  createAccount
}
