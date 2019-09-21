const firebase = require('firebase/app')
require('firebase/firestore')
require('firebase/auth')
require('firebase/functions')
require('firebase/storage')
const {
  FIREBASE_STAGING_API_KEY,
  FIREBASE_STAGING_AUTH_DOMAIN,
  FIREBASE_STAGING_DATABASE_URL,
  FIREBASE_STAGING_PROJECT_ID,
  FIREBASE_STAGING_STORAGE_BUCKET,
  FIREBASE_STAGING_MESSAGING_SENDER_ID
} = require('./credential')

const { DEVELOPMENT_SERVER_URL } = require('./constant')

const config = (module.exports.config =
  process.env.NODE_ENV === 'development'
    ? {
      apiKey: FIREBASE_STAGING_API_KEY,
      authDomain: FIREBASE_STAGING_AUTH_DOMAIN,
      databaseURL: FIREBASE_STAGING_DATABASE_URL,
      projectId: FIREBASE_STAGING_PROJECT_ID,
      storageBucket: FIREBASE_STAGING_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_STAGING_MESSAGING_SENDER_ID
    }
    : {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID
    })

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.firestore()

let functions
if (process.env.NODE_ENV === 'development') {
  // https://stackoverflow.com/questions/50884534/how-to-test-functions-https-oncall-firebase-cloud-functions-locally
  functions = firebase.functions().useFunctionsEmulator(DEVELOPMENT_SERVER_URL)
} else {
  functions = firebase.functions()
}

module.exports = {
  firebase,
  functions,
  db
}
