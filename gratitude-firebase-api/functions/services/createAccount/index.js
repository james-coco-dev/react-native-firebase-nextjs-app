const functions = require('firebase-functions')

const { dbRest } = require('../../lib/firebase')

// checks if the username base is taken. if so, increment by 1 and check again.
const getUsernameWithIncrement = async (usernameBase, count = 1) => {
  let user
  try {
    user = await dbRest
      .collection('users')
      .where('username', '==', `${usernameBase}${count > 1 ? count : ''}`)
      .get()
  } catch (err) {
    console.error(err)
  }
  let doc
  // there will only ever be one doc, so we can set it in the forEach
  user.forEach(d => { doc = d })
  console.info('doc', doc)
  // if the document exists, check the next iteration, otherwise return this value
  if (doc && doc.exists) {
    // eslint-disable-next-line
    return await getUsernameWithIncrement(usernameBase, (count + 1))
  } else {
    return `${usernameBase}${count}`
  }
}

module.exports.createAccount = functions.https.onCall(async (data, context) => {
  const { fullName } = data

  const usernameBase = fullName.split(' ').reduce((acc, v, i) => {
    if (i === 0) return v[0]
    return acc + v
  }, '').toLowerCase()

  const username = await getUsernameWithIncrement(usernameBase)

  console.log('username', username)

  try {
    await dbRest.collection('users').doc(context.auth.uid).set({
      fullName,
      username
    }, { merge: true })
  } catch (err) {
    console.error(err)
  }

  return {
    message: 'Success!'
  }
})
