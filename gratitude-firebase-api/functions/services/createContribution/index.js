const functions = require('firebase-functions')
const { secretKey, secretKeyTest } = require('../../credentials/stripe')

const { dbRest } = require('../../lib/firebase')

const key =
  process.env.NODE_ENV === 'development' ||
  process.env.GCLOUD_PROJECT === 'gratitude-staging'
    ? secretKeyTest
    : secretKey

const stripe = require('stripe')(key)

module.exports.createContribution = functions.https.onCall(
  async (data, context) => {
    const {
      source,
      amount,
      sourceString,
      dreamId,
      method,
      email,
      name,
      message
    } = data

    // get previous contribution count
    let count = 0
    let dream
    try {
      const result = await dbRest
        .collection('dreams')
        .doc(dreamId)
        .get()
      console.log(result)
      dream = result.data()
      // if there is no count, set equal to 0
      count = result.data().contributionCount || 0
    } catch (err) {
      console.error(err)
    }

    let user
    try {
      const result = await dbRest
        .collection('users')
        .doc(dream.createdBy)
        .get()
      user = result.data()
    } catch (err) {
      console.error(err)
    }

    // Charged for {dream name} by {dream author}
    const description = `Charged ${dream.title} by ${user.fullName}`

    let result = {}

    // for everything other than message, attempt the charge
    // TODO this should be better abstracted when we have more types
    if (method !== 'message') {
      try {
        result = await stripe.charges.create({
          currency: 'usd',
          source,
          amount,
          description
        })
        console.info(result)
      } catch (err) {
        console.error(err)
        throw new Error('Stripe charge failed')
      }
    }

    // if the charge succeeded, record the transaction
    try {
      const trx = await dbRest.collection('contributions').add({
        sourceString,
        createdAt: new Date(),
        amount: amount || null,
        method,
        email: email || null,
        name: name || null,
        message: message || null,
        description: description || null,
        chargeId: result.id || null,
        dreamId
      })
      console.info(trx)
    } catch (err) {
      console.error(err)
    }

    // once the contribution has been made, increase the contribution count on the initial object
    try {
      await dbRest
        .collection('dreams')
        .doc(dreamId)
        .set(
          {
            contributionCount: count + 1
          },
          { merge: true }
        )
    } catch (err) {
      console.error(err)
    }

    // once the contribution has been made, increase the user pending balance
    if (method !== 'message') {
      const balance = user.balance ? user.balance + amount : amount
      try {
        await dbRest
          .collection('users')
          .doc(dream.createdBy)
          .set(
            {
              balance: balance
            },
            { merge: true }
          )
      } catch (err) {
        console.error(err)
      }
    }

    return {
      message: 'Success!'
    }
  }
)
