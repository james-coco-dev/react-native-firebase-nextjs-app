const admin = require('firebase-admin')
const Firestore = require('firestore-rest')
const path = require('path')

var serviceAccount

// NOTE need to export these within the function because Firebase Functions does not allow upper-case
// variable names for some reason? If you try to do so, you'll get the following error:
// `Error: Invalid config name onCadenceAssignToContact.GOOGLE_APPLICATION_CREDENTIALS, cannot use upper case.`

if (
  process.env.NODE_ENV === 'development' ||
  process.env.GCLOUD_PROJECT === 'gratitude-staging'
) {
  serviceAccount = require('../credentials/gratitude-staging-firebase-adminsdk-hb5ys-9db548ca92.json')

  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
    __dirname,
    '../credentials/gratitude-staging-firebase-adminsdk-hb5ys-9db548ca92.json'
  )
  process.env.GCLOUD_PROJECT = 'gratitude-staging'

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gratitude-staging.firebaseio.com'
  })
} else {
  serviceAccount = require('../credentials/gratitude-62e2b-firebase-adminsdk-jqlhu-3328c60833.json')

  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
    __dirname,
    '../credentials/gratitude-62e2b-firebase-adminsdk-jqlhu-3328c60833.json'
  )
  process.env.GCLOUD_PROJECT = 'gratitude-62e2b'

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gratitude-62e2b.firebaseio.com'
  })
}

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })
const dbRest = new Firestore()

module.exports = {
  admin,
  firebase: admin,
  db,
  dbRest
}
