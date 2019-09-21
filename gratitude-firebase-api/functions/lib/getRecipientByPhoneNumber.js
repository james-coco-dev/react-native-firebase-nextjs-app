const { firebase } = require('./firebase')
const { formatPhoneNumber } = require('./formatPhoneNumber')

/**
 * Returns the recipient account information. If the account already exists, returns the
 * existing account. If no account exists, creates a new account and returns a reference
 * to that new account
 *
 * @param {string} rawPhone - a phone number in any valid format
 */
const getRecipientByPhoneNumber = async (rawPhone) => {
  const phoneNumber = formatPhoneNumber(rawPhone)

  let recipient
  let isNewAccount
  try {
    // if there is already a recipient in the database, set to value
    recipient = await firebase.auth().getUserByPhoneNumber(phoneNumber)
  } catch (err) {
    // if not, it will error, and that's fine
    // TODO we should probably handle these errors separately or squelch
    //   expected errors
    if (err.code !== 'auth/user-not-found') {
      console.error(err)
    }
  }

  // if a recipient does not exist in the database, add it to the database
  if (!recipient) {
    isNewAccount = true
    try {
      recipient = await firebase.auth().createUser({
        phoneNumber
      })
    } catch (err) {
      console.error(err)
    }
  }

  return {
    recipient,
    isNewAccount
  }
}

module.exports = {
  getRecipientByPhoneNumber
}
