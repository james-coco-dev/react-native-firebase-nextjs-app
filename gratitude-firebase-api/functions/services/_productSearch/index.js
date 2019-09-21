// https://github.com/dmcquay/node-apac#readme
const { OperationHelper } = require('apac')
const functions = require('firebase-functions')

const { awsId, awsSecret, assocId } = require('../../credentials/aws.json')

const opHelper = new OperationHelper({
  awsId,
  awsSecret,
  assocId
})

/**
 * Uses a search query to find items on Amazon.
 */
const productSearch = functions.https.onCall(async (data, context) => {
  const { query } = data

  let result
  try {
    result = await opHelper.execute('ItemSearch', {
      // 'SearchIndex': 'Books',
      'Keywords': query,
      'ResponseGroup': 'ItemAttributes,Offers'
    })
  } catch (err) {
    console.error(err)
  }
  console.log(result)
})

module.exports = {
  productSearch
}
