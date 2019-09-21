const functions = require('firebase-functions')
const { dbRest } = require('../../lib/firebase')

module.exports.getBankAccount = functions.https.onCall(
  async (data, context) => {
    if (!context.auth.uid) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Unauthorized'
      )
    }

    try {
      const res = await dbRest
        .collection('users')
        .doc(context.auth.uid)
        .collection('payments')
        .doc('bank')
        .get()
      return res.data()
    } catch (err) {
      return null
    }
  }
)
