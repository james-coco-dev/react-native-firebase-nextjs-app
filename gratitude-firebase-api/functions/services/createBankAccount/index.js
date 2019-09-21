const functions = require('firebase-functions')
const plaid = require('plaid')

const { secretKey, secretKeyTest } = require('../../credentials/stripe')
const { dbRest } = require('../../lib/firebase')

const key =
  process.env.NODE_ENV === 'development' ||
  process.env.GCLOUD_PROJECT === 'gratitude-staging'
    ? secretKeyTest
    : secretKey
const stripe = require('stripe')(key)

const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV } =
  process.env.NODE_ENV === 'development' ||
  process.env.GCLOUD_PROJECT === 'gratitude-staging'
    ? require('../../credentials/plaid-test')
    : require('../../credentials/plaid')

// https://github.com/plaid/plaid-node
const plaidClient = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV],
  { version: '2018-05-22' }
)

module.exports.createBankAccount = functions.https.onCall(
  async (data, context) => {
    if (!context.auth.uid) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Unauthorized'
      )
    }

    // publicToken is the one-time use token from plaid
    const { publicToken } = data

    let tokenResponse
    try {
      // exchanges public token generated on the client for an access token that
      // can be used for secure transactions
      tokenResponse = await plaidClient.exchangePublicToken(publicToken)
    } catch (err) {
      console.error(err)
    }

    /* At this point your token response should look like this:
    { access_token: 'access-sandbox-13bbad2c-38f8-475c-a3e6-b73a113f9d64',
      item_id: 'KQxNy3AJqvtwoMkMp64Vh8LgQWmMz8iV8Mkjx',
      request_id: 'rGJbe0uclWXMGOX',
      status_code: 200 }
  */

    let accounts
    try {
      const res = await plaidClient.getAccounts(tokenResponse.access_token)
      accounts = res.accounts
    } catch (err) {
      console.error(err)
    }

    // TODO this just assumes we take the first bank account. We probably want to give them
    // options for multiple accounts.
    const { account_id: accountId, mask, name } = accounts[0]

    // Get stripe_bank_account_token by using accountID and access_token
    // To get this data, you have to active ACH on plaid account.
    // Please see this url. https://plaid.com/docs/stripe.
    let stripeBankAccountToken = '01010101010101010'
    let requestId = '101029010101011201'

    try {
      const res = await plaidClient.createStripeToken(
        tokenResponse.access_token,
        accountId
      )
      stripeBankAccountToken = res.stripe_bank_account_token
      requestId = res.request_id
      console.log('stripe_bank_account_token => ', stripeBankAccountToken)
      console.log('request_id => ', requestId)
    } catch (err) {
      console.error(err)
    }

    // first test is to add the account to the user.
    try {
      const res = await dbRest
        .collection('users')
        .doc(context.auth.uid)
        .collection('payments')
        .doc('bank')
        .set({
          accountId,
          mask,
          name,
          stripeBankAccountToken,
          requestId
        })
      console.log(res)
    } catch (err) {
      console.error(err)
    }

    let user
    try {
      const result = await dbRest
        .collection('users')
        .doc(context.auth.uid)
        .get()
      user = result.data()
    } catch (err) {
      console.error(err)
    }

    // register customer by using stripe Id
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName,
      phone: user.phoneNumber || null
      // source: newValue.bank.stripeBankAccountToken
    })

    try {
      const res = await dbRest
        .collection('users')
        .doc(context.auth.uid)
        .collection('payments')
        .doc('stripe')
        .set({
          customerId: customer.id
        })
      console.log(res)
    } catch (err) {
      console.error(err)
    }

    return {
      accounts
    }
  }
)
