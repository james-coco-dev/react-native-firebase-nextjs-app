const functions = require('firebase-functions')
const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

const { sendPhoneVerification } = require('../../lib/auth')

const verifyPhone = functions.https.onCall(async (data, context) => {
  const { phoneNumber } = data

  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'US')
  const national = phoneUtil.format(number, PNF.NATIONAL)
  const countryCode = number.getCountryCode()

  try {
    await sendPhoneVerification(national, countryCode)
  } catch (err) {
    console.error(err)
  }

  return {
    message: 'Success'
  }
})

module.exports = {
  verifyPhone
}
