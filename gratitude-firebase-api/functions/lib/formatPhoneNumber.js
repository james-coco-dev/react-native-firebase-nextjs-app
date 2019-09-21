const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

/**
 * Formats phone numbers in E164 format.
 *
 * @param {string} rawPhoneNumber - a valid phone number in any format
 * @returns {string} - a '+14155154630' formatted phone number.
 */
const formatPhoneNumber = (rawPhoneNumber) => {
  const number = phoneUtil.parseAndKeepRawInput(rawPhoneNumber, 'US')
  // overwrite phone number with google libphonenumber's best guess as to the number
  const phoneNumber = phoneUtil.format(number, PNF.E164)
  return phoneNumber
}

module.exports = {
  formatPhoneNumber
}
