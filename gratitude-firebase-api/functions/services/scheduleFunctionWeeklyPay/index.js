const functions = require('firebase-functions')
const { dbRest } = require('../../lib/firebase')

// This is weekly cron job function.
// Every weekend this function is running and create a stripe transfer that send pending balance to users.
exports.scheduleFunctionWeeklyPay = functions.pubsub
  .topic('weekly-pay')
  .onPublish(async message => {
    let users = []

    try {
      const result = await dbRest.collection('users').get()
      result.docs.forEach(c => {
        users.push({ ...c.data(), id: c.id })
      })
    } catch (err) {
      console.error(err)
    }

    // Every weekend, user pending balance should be setted zero after success of stripe transfer.

    users.map(user => {
      if (user.stripe && user.balance && user.balance > 0) {
        console.log(
          'user data',
          user.balance,
          'account data',
          user.stripe.customerId
        )
        // No Delete
        // try {
        //   dbRest
        //     .collection("users")
        //     .doc(user.id)
        //     .set(
        //       {
        //         balance: 0
        //       },
        //       { merge: true }
        //     );
        // } catch (err) {
        //   console.error(err);
        // }
      }
    })

    return true
  })
