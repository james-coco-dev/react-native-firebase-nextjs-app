import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/storage'

export const config = {
  apiKey: 'AIzaSyDPZFiqjI6_-inqYrrZYM5GDzVZy3IcjqQ',
  authDomain: 'gratitude-62e2b.firebaseapp.com',
  databaseURL: 'https://gratitude-62e2b.firebaseio.com',
  projectId: 'gratitude-62e2b',
  storageBucket: 'gratitude-62e2b.appspot.com',
  messagingSenderId: '526207037665'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const db = firebase.firestore()

let functions
// if we're running locally (`development` is the default for react native), use localhost
if (process.env.NODE_ENV === 'development') {
  functions = firebase.functions().useFunctionsEmulator('http://localhost:5000')
} else {
  functions = firebase.functions()
}
// https://stackoverflow.com/questions/50884534/how-to-test-functions-https-oncall-firebase-cloud-functions-locally
export {
  functions
}

export default firebase
