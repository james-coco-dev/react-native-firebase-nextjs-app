const functions = require('firebase-functions')
const { dbRest } = require('../../lib/firebase')
const sgMail = require('@sendgrid/mail')

const { sendgridSecretKey } = require('../../credentials/sendgrid')
sgMail.setApiKey(sendgridSecretKey)

exports.onDreamWrite = functions.firestore
  .document('dreams/{dreamId}')
  .onWrite(async (change, context) => {
    const dream = change.after.exists ? change.after.data() : null
    console.info('dream', dream)

    let owner
    try {
      const result = await dbRest
        .collection('users')
        .doc(dream.createdBy)
        .get()
      owner = result.data()
    } catch (err) {
      console.error(err)
    }
    console.info('owner', owner)

    // confirmation email
    // https://sendgrid.com/dynamic_templates
    try {
      const content = {
        content: 'Create a Dream',
        creatorName: owner.fullName,
        dreamName: dream.title,
        dreamUrl: `https://givegratitude.co/dreams?dreamId=${
          context.params.dreamId
        }`
      }
      const msg = {
        to: owner.email,
        from: 'Gratitude <gratitude@creatorland.co>',
        subject: 'Dream Created',
        templateId: 'd-8c0ab670eade410b97f2d8130e9502ac',
        dynamic_template_data: content
      }
      console.info('Email message', msg)
      const email = await sgMail.send(msg)
      console.info('email', email)
    } catch (err) {
      console.error(err)
    }

    return null
  })
