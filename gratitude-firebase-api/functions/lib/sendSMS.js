const Twilio = require('twilio')
const { formatPhoneNumber } = require('./formatPhoneNumber')

const { accountSid, authToken } = require('../credentials/twilio')

var client = new Twilio(accountSid, authToken)

const sendSMS = async ({ body, to, from = '+14155926505' }) => {
  const result = await client.messages.create({
    body,
    to: formatPhoneNumber(to),
    from: formatPhoneNumber(from)
  })
  return result
}

module.exports = {
  sendSMS
}
