const functions = require('firebase-functions')
const { dbRest } = require('../../lib/firebase')

/**
 * Deletes a document with ID -> uid in the `users` collection.
 *
 * @param {Object} userRecord - Contains the auth, uid, and other info
 * @param {Object} context - Details about the event
 */
const deleteProfile = (userRecord, context) => {
  return dbRest
    .collection('users')
    .doc(userRecord.uid)
    .delete()
    .then(doc => console.info('User deleted: ', JSON.stringify(doc)))
    .catch(console.error)
}

/**
 * Creates a document with ID -> uid in the `users` collection.
 *
 * @param {Object} userRecord - Contains the auth, uid, and other info
 * @param {Object} context - Details about the event.
 */
const createProfile = (userRecord, context) => {
  console.info('userRecord', userRecord)
  console.info('context', context)
  return dbRest
    .collection('users')
    .doc(userRecord.uid)
    .set({
      email: userRecord.email,
      // TODO should probably normalize this value
      phoneNumber: userRecord.phoneNumber
    }, { merge: true })
    .then(doc => console.info('User created: ', JSON.stringify(doc)))
    .catch(console.error)
}

module.exports = {
  authOnDelete: functions.auth.user().onDelete(deleteProfile),
  authOnCreate: functions.auth.user().onCreate(createProfile)
}
