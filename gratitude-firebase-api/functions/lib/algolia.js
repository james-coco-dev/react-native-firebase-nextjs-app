const algoliasearch = require('algoliasearch')
const {
  applicationId,
  adminAPIKey,
  devIndexName,
  prodIndexName
} = require('../credentials/algolia')

// https://itnext.io/how-to-add-fast-realtime-search-to-your-firebase-app-with-algolia-2491f7698d52
// config algoliasearch by using application id and admin API key.
const algolia = algoliasearch(applicationId, adminAPIKey)

var index
if (
  process.env.NODE_ENV === 'development' ||
  process.env.GCLOUD_PROJECT === 'gratitude-staging'
) {
  // set index name by using prefix "dev_" when development
  index = algolia.initIndex(devIndexName)
} else {
  // set index name by using prefix "prod_" when production
  index = algolia.initIndex(prodIndexName)
}

module.exports = {
  index
}
