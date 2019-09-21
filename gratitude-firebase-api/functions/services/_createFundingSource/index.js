const functions = require('firebase-functions')
const dwolla = require('dwolla-v2')
const plaid = require('plaid')

const { db } = require('../../lib/firebase')

// TODO these are test keys
const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } = require('../../credentials/plaid-test')
const { KEY, SECRET, ENVIRONMENT } = require('../../credentials/dwolla-test')

// https://github.com/plaid/plaid-node
const plaidClient = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: '2018-05-22' }
)

const dwollaClient = new dwolla.Client({
  key: KEY,
  secret: SECRET,
  environment: ENVIRONMENT
})

/**
 * This function authorizes a user, checks to see if the user already has a Dwolla
 * accountId (if so, don't create another one), gets the ACH credentials
 * (account and routing numbers), passes those credentials to Dwolla,
 * then creates a Dwolla customer with those credentials, then adds the
 * funding source with the ACH credentials.
 */
const createFundingSource = functions.https.onCall(async (data, context) => {
  if (!context.auth.uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Unauthorized')
  }

  // we know the user is logged in at this point. get the user's data and see if they already
  // have dwolla account information

  let user
  try {
    user = await db.collection('users').doc(context.auth.uid).get()
  } catch (err) {
    console.error(err)
  }
  console.info('user', { ...user.data(), id: user.id })

  // TODO figure out relationship between dwollaCustomerId
  // and funding-sources

  if (user.data().dwollaCustomerId) {
    // if this user already has a dwolla customer Id, we don't need to create a new account
    throw new functions.https.HttpsError('failed-precondition', 'Account already registered')
  }

  // publicToken is the one-time use token from plaid
  // accountId is the specific bank account to be used
  const {
    publicToken,
    accountId,
    mask,
    type,
    name,
    bank
  } = data
  const {
    firstName,
    lastName,
    email,
    address1,
    city,
    state,
    postalCode,
    dateOfBirth,
    ssn
  } = data

  if (!publicToken || !accountId) {
    throw new functions.https.HttpsError('failed-precondition', 'Missing token or accountId')
  }

  let tokenResponse
  try {
    // exchanges public token generated on the client for an access token that
    // can be used for secure transactions
    tokenResponse = await plaidClient.exchangePublicToken(publicToken)
  } catch (err) {
    console.error(err)
  }

  console.info(JSON.stringify('plaid exchange response', tokenResponse))

  let processorResponse
  try {
    // https://plaid.com/docs/dwolla/
    processorResponse = await plaidClient.createProcessorToken(tokenResponse.access_token, accountId, 'dwolla')
  } catch (err) {
    console.error(err)
  }

  console.info('processor response', processorResponse)

  // let result
  // try {
  //   // pulls routing and account numbers from the customer's account data
  //   result = await plaidClient.getAuth(tokenResponse.access_token, { account_ids: [accountId] })
  // } catch (err) {
  //   console.error(err)
  // }

  // console.info(JSON.stringify('plaidResult', result))

  // // TODO need better error handling here
  // if (!result.numbers.ach[0]) {
  //   throw new Error('Missing ach credentials')
  // }

  /**
   * At this point, we have our customer's account and routing numbers, as well
   * as their permission to create an account for them. We now need to create a
   * Dwolla Customer for that user, then attach the account credentials to that user
   */

  // const { account, routing } = result.numbers.ach[0]

  const app = await dwollaClient.auth.client()

  var requestBody = {
    firstName, // An individual Customer’s first name.
    lastName, // An individual Customer’s last name.
    email, // Customer’s email address. NOTE this is the primary key
    type: 'personal', // The Verified Customer type. Set to personal if creating a verified personal Customer.
    address1, // First line of the street address of the Customer’s permanent residence. Must be 50 characters or less. Note: PO Boxes are not allowed.
    city, // City of Customer’s permanent residence.
    state, // Two letter abbreviation of the state in which the Customer resides, e.g. CA.
    postalCode, // Postal code of Customer’s permanent residence. US five-digit ZIP or ZIP + 4 code. e.g. 50314.
    dateOfBirth, // Customer’s date of birth in YYYY-MM-DD format. Must be 18 years or older.
    ssn // Last four digits of the Customer’s Social Security Number.
  }

  const customerResult = await app.post('customers', requestBody)

  const customerUrl = customerResult.headers.get('location')
  console.info('customerUrl', customerUrl)

  // https://stackoverflow.com/questions/8945477/regular-expression-for-getting-everything-after-last-slash
  const customerId = customerUrl.match(/([^/]+$)/g)[0]
  console.info('customerId', customerId)

  try {
    await db.collection('users').doc(context.auth.uid).set({
      dwollaCustomerId: customerId
    }, { merge: true })
  } catch (err) {
    console.error(err)
  }

  // customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
  // request_body = {
  //   plaidToken: 'processor-sandbox-161c86dd-d470-47e9-a741-d381c2b2cb6f',
  //   name: 'Jane Doe’s Checking'
  // }

  // appToken
  // .post(`${customerUrl}/funding-sources`, requestBody)
  // .then(res => res.headers.get('location'));

  // TODO this needs to be changed in production
  const baseUrl = 'https://api-sandbox.dwolla.com/customers/'

  let fundingResult
  try {
    fundingResult = await app.post(`${baseUrl}${customerId}/funding-sources`, {
      plaidToken: processorResponse.processor_token,
      name: `${name} checking`
    })
  } catch (err) {
    console.error(err)
  }

  console.info('funding result', fundingResult)

  const locationUrl = fundingResult.headers.get('location')
  console.info('location url', locationUrl)
  const fundingSourceId = locationUrl.match(/([^/]+$)/g)[0]

  try {
    await db.collection('users').doc(context.auth.uid).collection('fundingSources').add({
      mask,
      type,
      name,
      bank,
      fundingSourceId
    })
  } catch (err) {
    console.error(err)
  }

  // associate the funding source with the customer
  // https://docs.dwolla.com/#create-a-funding-source-for-a-customer
  // const fundingResult = await app.post(`${customerUrl}/funding-sources`, {
  //   accountNumber: account,
  //   routingNumber: routing,
  //   bankAccountType: result.accounts[0].subtype || 'checking',
  //   name: result.accounts[0].name || 'Default',
  //   plaidToken: tokenResponse.access_token
  // })

  // const fundingUrl = fundingResult.headers.get('location')
  // console.info('fundingUrl', fundingUrl)

  return {
    customerId
  }
})

module.exports = {
  createFundingSource
}
