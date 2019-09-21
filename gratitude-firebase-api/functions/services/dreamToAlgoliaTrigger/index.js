const functions = require('firebase-functions')
const { dbRest } = require('../../lib/firebase')
const { index } = require('../../lib/algolia')

// When create a dream, dream data and user's fullName should be added to Algolia
// data = {dreamId, dream.title, dream.story, dream.hashtags, author}
exports.addDreamToAlgolia = functions.firestore
  .document('dreams/{dreamId}')
  .onCreate(async (snap, context) => {
    const newValue = snap.data()

    let author
    try {
      const result = await dbRest
        .collection('users')
        .doc(newValue.createdBy)
        .get()
      author = result.data()
    } catch (err) {
      console.error(err)
    }

    let hashtags = []
    for (var key in newValue.hashtags) {
      hashtags.push(key)
    }

    const data = {
      objectID: context.params.dreamId,
      author: author.fullName,
      avatarUrl: author.avatarUrl,
      title: newValue.title,
      story: newValue.story,
      hashtags: hashtags,
      imageUrl: newValue.imageUrl,
      contributionCount: newValue.contributionCount
        ? newValue.contributionCount
        : 0
    }

    return addToAlgolia(data)
      .then(res => console.log('SUCCESS ALGOLIA DATA ADD', res))
      .catch(err => console.log('ERROR ALGOLIA DATA ADD', err))
  })

// When update a dream, dream data and user's fullName should be updated to Algolia
// data = {dreamId, dream.title, dream.story, dream.hashtags, author}
exports.editDreamToAlgolia = functions.firestore
  .document('dreams/{dreamId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data()

    let author
    try {
      const result = await dbRest
        .collection('users')
        .doc(newValue.createdBy)
        .get()
      author = result.data()
    } catch (err) {
      console.error(err)
    }

    let hashtags = []
    for (var key in newValue.hashtags) {
      hashtags.push(key)
    }

    const data = {
      objectID: context.params.dreamId,
      author: author.fullName,
      avatarUrl: author.avatarUrl,
      title: newValue.title,
      story: newValue.story,
      hashtags: hashtags,
      imageUrl: newValue.imageUrl,
      contributionCount: newValue.contributionCount
        ? newValue.contributionCount
        : 0
    }

    return editToAlgolia(data)
      .then(res => console.log('SUCCESS ALGOLIA DATA EDIT', res))
      .catch(err => console.log('ERROR ALGOLIA DATA EDIT', err))
  })

// When update user's fullName, Algolia data should be updated
// data = {dreamId, dream.title, dream.story, dream.hashtags, author}
exports.userToAlgoliaTrigger = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()

    if (
      newValue.fullName !== previousValue.fullName ||
      newValue.avatarUrl !== previousValue.avatarUrl
    ) {
      console.log('user fullname change => ', newValue.fullName)

      try {
        const result = await dbRest
          .collection('dreams')
          .where('createdBy', '==', context.params.userId)
          .get()

        await Promise.all(
          result.docs.map(c => {
            const dream = c.data()
            let hashtags = []
            for (var key in dream.hashtags) {
              hashtags.push(key)
            }

            const data = {
              objectID: c.id,
              author: newValue.fullName,
              avatarUrl: newValue.avatarUrl,
              title: dream.title,
              story: dream.story,
              hashtags: hashtags,
              imageUrl: dream.imageUrl,
              contributionCount: dream.contributionCount
                ? dream.contributionCount
                : 0
            }

            editToAlgolia(data)
              .then(res => console.log('SUCCESS ALGOLIA DATA EDIT', res))
              .catch(err => console.log('ERROR ALGOLIA DATA EDIT', err))
          })
        )
      } catch (err) {
        console.error(err)
      }
    }
  })

// function that add dream and user to Aloglia
function addToAlgolia (object) {
  return new Promise((resolve, reject) => {
    index
      .addObject(object)
      .then(res => {
        console.log('res GOOD', res)
        resolve(res)
      })
      .catch(err => {
        console.log('err BAD', err)
        reject(err)
      })
  })
}

// function that update dream and user data to Aloglia
function editToAlgolia (object) {
  return new Promise((resolve, reject) => {
    index
      .saveObject(object)
      .then(res => {
        console.log('res GOOD', res)
        resolve(res)
      })
      .catch(err => {
        console.log('err BAD', err)
        reject(err)
      })
  })
}
