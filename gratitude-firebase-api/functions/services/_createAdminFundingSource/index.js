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
  KEY,
  SECRET,
  ENVIRONMENT
})

/**
 * Creates a funding source for the company, rather than for a customer. In Dwolla,
 * company accounts are called "Account"
 */
const createAdminFundingSource = () => {

}
