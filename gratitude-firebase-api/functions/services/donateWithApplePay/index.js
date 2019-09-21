const functions = require('firebase-functions')

const { dbRest } = require('../../lib/firebase')
const {
  getRecipientByPhoneNumber
} = require('../../lib/getRecipientByPhoneNumber')
const { formatPhoneNumber } = require('../../lib/formatPhoneNumber')
const { sendSMS } = require('../../lib/sendSMS')

const { secretKey, secretKeyTest } = require('../../credentials/stripe')
const key =
  process.env.NODE_ENV === 'development' ||
  process.env.GCLOUD_PROJECT === 'gratitude-staging'
    ? secretKeyTest
    : secretKey

const stripe = require('stripe')(key)

const donateWithApplePay = functions.https.onCall(async (data, context) => {
  if (!context.auth.uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Unauthorized')
  }

  const { token, amount, description, charity, sentOnBehalfOf } = data

  console.info('data', data)

  const phoneNumber = formatPhoneNumber(sentOnBehalfOf.phoneNumber)

  let recipient
  try {
    const res = await getRecipientByPhoneNumber(phoneNumber)
    recipient = res.recipient
  } catch (err) {
    console.error(err)
  }

  let result
  try {
    result = await stripe.charges.create({
      currency: 'usd',
      source: token.tokenId,
      amount,
      description
    })
    console.info(result)
  } catch (err) {
    console.error(err)
    throw new Error('Stripe charge failed')
  }

  // if the charge succeeded, record the transaction
  try {
    const trx = await dbRest.collection('transactions').add({
      sourceId: context.auth.uid,
      createdAt: new Date(),
      amount,
      description,
      chargeId: result.id,
      charity,
      recipientId: recipient.uid
    })
    console.info(trx)
  } catch (err) {
    console.error(err)
  }

  try {
    await sendSMS({
      to: phoneNumber,
      body: `Someone sent $${Math.round(amount / 100).toFixed(
        2
      )} on your behalf: ${description}`
    })
  } catch (err) {
    console.error(err)
  }

  // then re-fetch the transaction and return it to the client

  return {
    amount,
    description,
    charity
  }
})

module.exports = {
  donateWithApplePay
}
