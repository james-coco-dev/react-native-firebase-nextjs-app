const functions = require('firebase-functions')

const sgMail = require('@sendgrid/mail')

const { sendgridSecretKey } = require('../../credentials/sendgrid')
sgMail.setApiKey(sendgridSecretKey)

module.exports.sendProfile = functions.https.onCall(async (data, context) => {
  const { sendTo, user, url } = data

  console.info('sendTo', sendTo)
  console.info('url', url)
  console.info('user', user)

  // TODO for now, sendTo is only email. Eventually check if this is a phone number

  const content = {
    content: 'Someone has sent you a profile',
    profileName: user.fullName,
    profileUrl: `https://givegratitude.co/profile?id=${user.id}`
  }

  const msg = {
    from: 'Gratitude <gratitude@creatorland.co>',
    to: sendTo,
    subject: 'Someone has sent you a profile',
    templateId: 'd-98a3e82c9a5848e0b5a0da6faaf2cabd',
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
