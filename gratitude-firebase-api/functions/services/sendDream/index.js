const functions = require('firebase-functions')

const sgMail = require('@sendgrid/mail')

const { sendgridSecretKey } = require('../../credentials/sendgrid')
sgMail.setApiKey(sendgridSecretKey)

module.exports.sendDream = functions.https.onCall(async (data, context) => {
  const { sendTo, dream, user } = data

  console.info('sendTo', sendTo)
  console.info('dream', dream)
  console.info('user', user)

  // TODO for now, sendTo is only email. Eventually check if this is a phone number

  const content = {
    content: 'Someone shared a dream with you via Gratitude',
    creatorName: user.fullName,
    dreamName: dream.title,
    dreamUrl: `https://givegratitude.co/dreams?dreamId=${dream.id}`
  }

  const msg = {
    from: 'Gratitude <gratitude@creatorland.co>',
    to: sendTo,
    subject: 'Someone shared a dream with you via Gratitude',
    templateId: 'd-2065d8145dce4333b0f1d6e9b4f4bcc2',
    dynamic_template_data: content
  }

  try {
    const result = await sgMail.send(msg)
    console.log('email result', result)
  } catch (err) {
    console.error(err)
    return {
      error: 'Email failed to send'
    }
  }

  return {
    message: 'Success!'
  }
})
