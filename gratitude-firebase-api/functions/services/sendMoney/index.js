const functions = require('firebase-functions')
const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()
const crypto = require('crypto')
const dwolla = require('dwolla-v2')

const { KEY, SECRET, ENVIRONMENT } = require('../../credentials/dwolla-test')

const { getRecipientByPhoneNumber } = require('../../lib/getRecipientByPhoneNumber')

const dwollaClient = new dwolla.Client({
  key: KEY,
  secret: SECRET,
  environment: ENVIRONMENT
})

const base64url = require('base64url')

const { dbRest } = require('../../lib/firebase')
const { sendSMS } = require('../../lib/sendSMS')

/**
 * Generates a random 8-digit string which gets attached to a given transaction
 * so that a user can claim their account using a web interface
 */
const generateSlug = () => {
  // https://github.com/brianloveswords/base64url
  // need to use a special package so that the base64 value is url safe
  return base64url(crypto.randomBytes(6))
}

/**
 * Allows a user to send money to another user. First it creates a new transaction.
 * Supports phone-based money sending.
 *
 * TODO how to later associate a transaction with a user.uid?
 * TODO need to figure out how Venmo handles this problem.
 */
const sendMoney = functions.https.onCall(async (data, context) => {
  if (!context.auth.uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Unauthorized')
  }

  const { to, message, amount, sourceId } = data

  /**
   * `to` should be an object.
   *
   * {
   *   type: String // 'username', 'email', 'phone'; currently only supports phone
   *   value: String // @samcorcos, sam@corcos.io, +14155154630
   * }
   */

  if (!to || !message || !amount || !sourceId) {
    throw new functions.https.HttpsError('failed-precondition', 'Missing information')
  }

  if (to.type === 'username') {
    // TODO handle it as in-network with existing account information
    return null
  }

  if (to.type === 'email') {
    // TODO handle this differently than phone
  }

  // the first thing to do is to check whether or not the user exists. if there is no
  // user associated with the phone number provided, create a new placeholder user. if the
  // user already exists, set the recipient to that user
  let phoneNumber
  let recipient
  let isNewAccount
  if (to.type === 'phone') {
    const number = phoneUtil.parseAndKeepRawInput(to.value, 'US')
    // overwrite phone number with google libphonenumber's best guess as to the number
    phoneNumber = phoneUtil.format(number, PNF.E164)
    const res = await getRecipientByPhoneNumber(phoneNumber)
    recipient = res.recipient
    isNewAccount = res.isNewAccount
  }

  // Check to make sure the person sending the funds already has a dwolla customer id
  // The dwolla customer Id gives us access to their funding source
  let sourceUser
  try {
    sourceUser = await dbRest.collection('users').doc(context.auth.uid).get()
    if (!sourceUser || !sourceUser.data() || !sourceUser.data().dwollaCustomerId) {
      return {
        error: 'Missing Dwolla customer ID'
      }
    }
  } catch (err) {
    console.error(err)
  }

  // Check to make sure they have a funding source (i.e. a bank account)
  let fundingSource
  try {
    const res = await dbRest.collection('users').doc(context.auth.uid).collection('fundingSources').doc(sourceId).get()
    fundingSource = res.data()
  } catch (err) {
    console.error(err)
    return err
  }

  // if there is no funding source throw an error
  if (!fundingSource.fundingSourceId) {
    throw new functions.https.HttpsError('missing-information', 'User does not have a funding source')
  }

  const app = await dwollaClient.auth.client()

  // TODO this is gratitude's test account id. this will have to be changed in production
  const gratitudeAccountId = 'ed0a133a-7fd1-4393-9585-db63be3f1b8b'

  const requestBody = {
    _links: {
      source: {
        href: `https://api-sandbox.dwolla.com/funding-sources/${fundingSource.fundingSourceId}`
      },
      destination: {
        href: `https://api-sandbox.dwolla.com/funding-sources/${gratitudeAccountId}`
      }
    },
    amount: {
      currency: 'USD',
      value: `${Math.round(amount / 100).toFixed(2)}`
    },
    metadata: {
      paymentId: Date.now(),
      note: 'Standard transfer'
    },
    clearing: {
      destination: 'next-available'
    }
  }

  // now that we've confirmed that the user has an account and has already registered a funding source with
  // dwolla, create the transfer from the user to the Gratitude account
  let transfer
  try {
    const res = await app.post('transfers', requestBody)
    transfer = res.headers.get('location')
  } catch (err) {
    console.error(err)
    // if the transfer fails, return the error
    return err
  }

  console.info('transfer', transfer)
  const transferId = transfer.match(/([^/]+$)/g)[0]
  console.info('transferId', transferId)

  // if the transfer worked, record the transaction in the database

  const slug = generateSlug()

  const transactionData = {
    sourceId: context.auth.uid,
    createdAt: new Date(),
    amount,
    message,
    transferId, // the id of the dwolla transfer for reference
    // TODO might want to check to make sure we don't duplicate slugs?
    // TODO remove slug once account has been claimed?
    slug,
    recipientId: recipient.uid
  }

  let transaction
  try {
    console.info('transaction data', transactionData)
    transaction = await dbRest.collection('transactions').add(transactionData)
  } catch (err) {
    // TODO need to figure out a better way to handle this error
    console.error('CRITICAL: transfer succeeded but transaction failed to record', requestBody)
    console.error(err)
  }

  console.info('transactionId', transaction.id)

  // we now need to update the user profile to show their balance
  // we need to update both the source and the recipient
  // TODO when we allow people to use their balance to send between parties,
  // we will need to update the source here as well
  try {
    const user = await dbRest.collection('users').doc(recipient.uid).get()
    const { balance } = user.data()

    const newBalance = (balance || 0) + amount

    await dbRest.collection('users').doc(recipient.uid).set({
      balance: newBalance
    }, { merge: true })
  } catch (err) {
    console.error(err)
  }

  // at this point, we have recorded the transaction and we've made the transfer, so we need to notify the user
  // that the funds have been sent to them

  // hard-coded twilio number
  const from = '+14155926505'

  let smsResult
  const body = () => {
    // if it's a new account, send the claim link
    if (isNewAccount) {
      const m = `${sourceUser.fullName}: ${message}\n\nClaim your account here: http://localhost:3000/claim?token=${slug}`
      console.info('Message sent to new user', m)
      return m
    }
    const m = `${sourceUser.fullName}: ${message}`
    console.info('Message sent to user', m)
    return m
  }

  try {
    smsResult = await sendSMS({ to: phoneNumber, body: body(), from })
  } catch (err) {
    console.error(err)
  }

  console.info('sms result', smsResult)

  return {
    data
  }
})

module.exports = {
  sendMoney
}
