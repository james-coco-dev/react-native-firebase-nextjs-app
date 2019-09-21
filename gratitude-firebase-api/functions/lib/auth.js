const { PRODUCTION_API_KEY } = require('../credentials/authy')
const authy = require('authy')(PRODUCTION_API_KEY)

const testUser = {
  national: '(424) 242-4242',
  countryCode: 1,
  phoneVerification: '424242'
}

/**
 * Takes in values and returns true if values match the test user. Otherwise return false.
 *
 * @param {string} national - national phone number
 * @param {string} countryCode - country code
 * @param {string} phoneVerification - phone verification
 */
const isTestUser = (national, countryCode, phoneVerification) => {
  let pass = 0
  if (national === testUser.national) pass += 1
  if (countryCode === testUser.countryCode) pass += 1
  if (phoneVerification === testUser.phoneVerification) pass += 1

  // returns the number of conditions passed
  return pass
}

/**
 * Triggers Twilio Verify to send a verification code.
 *
 * @param {string} national - national phone number
 * @param {string} countryCode - country code
 * @param {Object} options - the options for sending the code
 */
const sendPhoneVerification = (national, countryCode, options) => new Promise((resolve, reject) => {
  if (isTestUser(national, countryCode) === 2) {
    const message = { message: 'Test user: phone verication skipped' }
    console.info(message)
    return resolve(message)
  }

  const options = {
    via: 'sms',
    locale: 'en',
    code_length: '6'
  }

  return authy.phones().verification_start(national, countryCode, options, (err, res) => {
    if (err) return reject(err)
    console.info(res)
    return resolve(res)
  })
})

/**
 * Authenticates a user based on phone number and phone verification code sent by
 * Twilio. Uses [Twilio Verify](https://www.twilio.com/docs/verify/api).
 *
 * If verification fails, throws an error. If succeeds, returns object.
 *
 * @param {string} national - national phone number, exclusive of country code
 * @param {string} countryCode - country code (e.g. '+1')
 * @param {string} phoneVerification - the verification string from Twilio verify (e.g. '513221')
 *
 * @returns {Object|Error}
 */
const authenticate = (national, countryCode, phoneVerification) => new Promise((resolve, reject) => {
  // NOTE we need to include special login credentials for Apple user testing
  if (isTestUser(national, countryCode, phoneVerification) === 3) {
    return resolve({ message: 'Authorized as test user' })
  }
  return authy.phones().verification_check(national, countryCode, phoneVerification, (err, res) => {
    if (err) return reject(err)
    return resolve(res)
  })
})

module.exports = {
  authenticate,
  testUser,
  sendPhoneVerification
}
