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

const listAdminFundingSources = async () => {
  const app = await dwollaClient.auth.client()

  // Run this to get account ID from root:
  /*
    app
      .get('/')
      .then(res => console.info(res.body._links.account.href))
  */

  // account ID from root:
  const accountId = '9b856a50-b0d8-4b28-8c6a-dc8f5100f551'

  // account id?
  // const accountId = 'e91ece90-2b36-4bdc-9e2b-f0469d192390'

  // funding source id?
  // const fundingId = 'ed0a133a-7fd1-4393-9585-db63be3f1b8b'
  const accountUrl = `https://api-sandbox.dwolla.com/accounts/${accountId}`

  // run this to get all available endpoints for this account:
  /*
    app
      .get(accountUrl)
      .then(res => console.info(res.body)) // => 'Jane Doe'
  */

  const accountFundingSourcesUrl = `https://api-sandbox.dwolla.com/accounts/${accountId}/funding-sources`

  // run this to get all funding sources for the account
  // app
  //   .get(accountFundingSourcesUrl)
  //   .then(res => console.info(JSON.stringify(res.body._embedded['funding-sources'])))

  // this is the funding source for superhero savings bank, which is the default bank that
  // dwolla has in their sandbox. We use this as our intermediate bank
  const fundingSourceId = 'ed0a133a-7fd1-4393-9585-db63be3f1b8b'
}

// node services/listAdminFundingSources
listAdminFundingSources()
