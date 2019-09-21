const functions = require('firebase-functions')
const { dbRest } = require('../../lib/firebase')
const sgMail = require('@sendgrid/mail')

const { sendgridSecretKey } = require('../../credentials/sendgrid')
sgMail.setApiKey(sendgridSecretKey)

exports.onContributionWrite = functions.firestore
  .document('contributions/{contributionId}')
  .onWrite(async (change, context) => {
    const contribution = change.after.exists ? change.after.data() : null
    console.info('contribution', contribution)

    let dream
    try {
      const result = await dbRest
        .collection('dreams')
        .doc(contribution.dreamId)
        .get()
      dream = result.data()
    } catch (err) {
      console.error(err)
    }
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
    try {
      const content = {
        content: 'Create a Dream',
        creatorName: owner.fullName,
        dreamName: dream.title,
        dreamUrl: `https://givegratitude.co/dreams?dreamId=${
          contribution.dreamId
        }`
      }
      const msg = {
        from: 'Gratitude <gratitude@creatorland.co>',
        to: contribution.email,
        subject: 'You successfully contributed to a dream',
        templateId: 'd-4646cd3ab8084b3aac652f124ea4fddc',
        dynamic_template_data: content
      }
      console.info('Email message for sender', msg)
      const result = await sgMail.send(msg)
      console.info('Email result for sender', result)
    } catch (err) {
      console.error(err)
    }

    // notification for owner
    try {
      const content = {
        content: 'Receive a contribute',
        contributorName: contribution.name,
        contributorAmount:
          contribution.amount === null
            ? ''
            : '$' + parseFloat(contribution.amount / 100).toFixed(2),
        contributorMessage: contribution.message,
        dreamName: dream.title,
        dreamUrl: `https://givegratitude.co/dreams?dreamId=${
          contribution.dreamId
        }`
      }

      const msg = {
        from: 'Gratitude <gratitude@creatorland.co>',
        to: owner.email,
        subject: 'Notification',
        templateId: 'd-78f094fd548644c780ad6a14b7e5ccc1',
        dynamic_template_data: content
      }
      console.info('Email message for recipient', msg)
      const result = await sgMail.send(msg)
      console.info('Email result for recipient', result)
    } catch (err) {
      console.error(err)
    }

    return null
  })
