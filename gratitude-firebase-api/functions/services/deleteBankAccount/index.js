const functions = require('firebase-functions')
const { dbRest } = require('../../lib/firebase')
const { secretKey, secretKeyTest } = require('../../credentials/stripe')

const key =
  process.env.NODE_ENV === 'development' ||
  process.env.GCLOUD_PROJECT === 'gratitude-staging'
    ? secretKeyTest
    : secretKey
const stripe = require('stripe')(key)

module.exports.deleteBankAccount = functions.https.onCall(
  async (data, context) => {
    if (!context.auth.uid) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Unauthorized'
      )
    }

    let stripeData
    try {
      const res = await dbRest
        .collection('users')
        .doc(context.auth.uid)
        .collection('payments')
        .doc('stripe')
        .get()
      stripeData = res.data()
      console.log(res.data())
    } catch (err) {
      console.error(err)
    }

    stripe.customers.del(stripeData.customerId)
    // All data shold be deleted
    try {
      const res = await dbRest
        .collection('users')
        .doc(context.auth.uid)
        .collection('payments')
        .doc('bank')
        .set({})
      console.log(res)
    } catch (err) {
      console.error(err)
    }

    try {
      const res = await dbRest
        .collection('users')
        .doc(context.auth.uid)
        .collection('payments')
        .doc('stripe')
        .set({})
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }
)
