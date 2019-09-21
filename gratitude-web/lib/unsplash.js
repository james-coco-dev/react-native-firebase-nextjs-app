const Unsplash = require('unsplash-js').default

// https://www.pluralsight.com/guides/using-the-unsplash-api
// https://github.com/unsplash/unsplash-js
// Set Unsplash config
const {
  UNSPLASH_APP_ACCESS_KEY,
  UNSPLASH_APP_SECRET
} = require('./credential')

const unsplash = new Unsplash({
  applicationId: UNSPLASH_APP_ACCESS_KEY,
  secret: UNSPLASH_APP_SECRET
})

module.exports = {
  unsplash
}
