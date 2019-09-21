const algoliasearch = require('algoliasearch')
const {
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_SEARCH_ONLY_API_KEY,
  ALGOLIA_DEV_INDEX_NAME,
  ALGOLIA_PROD_INDEX_NAME
} = require('./credential')

// https://itnext.io/how-to-add-fast-realtime-search-to-your-firebase-app-with-algolia-2491f7698d52
// Get using method of firebase + Algoliar in the frontend and backend
const client = algoliasearch(
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_SEARCH_ONLY_API_KEY
)
let index

if (
  process.env.NODE_ENV === 'development' ||
  process.env.SERVER_ENV === 'staging'
) {
  index = client.initIndex(ALGOLIA_DEV_INDEX_NAME)
} else {
  index = client.initIndex(ALGOLIA_PROD_INDEX_NAME)
}

module.exports = {
  index
}
