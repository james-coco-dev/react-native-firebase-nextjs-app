const shell = require('shelljs')
const chalk = require('chalk')
const credential = require('../lib/credential')
const env = require('../now.json').build.env

// TODO if all credentials are present, run this
credentialSuccessHandle = () => {
  shell.echo(chalk.greenBright('*****************************************'))
  shell.echo(chalk.greenBright('****** CHECK CREDENTIALS SUCCESS! *******'))
  shell.echo(chalk.greenBright('*****************************************'))
  shell.exec('now --target production')
}

// TODO if a credential is missing, throw error
credentialErrorHandle = message => {
  shell.echo(chalk.red('***********************************************'))
  shell.echo(chalk.red('DEPLOY FAILED!: Some credentials were missed!'))
  shell.echo(chalk.red('There is no ' + message + '.'))
  shell.echo(chalk.red('Please add this credential.'))
  shell.echo(chalk.red('***********************************************'))
  shell.exit(1)
}

// TODO check to make sure all required credentials are present
// Check Firebase Credentials in now.json
!env.API_KEY && credentialErrorHandle('Firebase Production API key')
!env.AUTH_DOMAIN && credentialErrorHandle('Firebase Production Auth Domain')
!env.DATABASE_URL && credentialErrorHandle('Firebase Production Database URL')
!env.PROJECT_ID && credentialErrorHandle('Firebase Production Project Id')
!env.STORAGE_BUCKET &&
  credentialErrorHandle('Firebase Production Storage Bucket')
!env.MESSAGING_SENDER_ID &&
  credentialErrorHandle('Firebase Production Messaging Sender Id')

// Check Other API Credentials in the credential.js
!credential.ALGOLIA_APPLICATION_ID &&
  credentialErrorHandle('Algolia Application Id')
!credential.ALGOLIA_SEARCH_ONLY_API_KEY &&
  credentialErrorHandle('Algolia Search Only API Key')
!credential.ALGOLIA_PROD_INDEX_NAME &&
  credentialErrorHandle('Algolia Production Indexname')
!credential.STRIPE_PUBLISH_KEY && credentialErrorHandle('Stripe Publish Key')
!credential.PLAID_PUBLIC_KEY && credentialErrorHandle('Plaid Public Key')
!credential.PLAID_PROD_ENV && credentialErrorHandle('Plaid Production ENV')
!credential.UNSPLASH_APP_ACCESS_KEY &&
  credentialErrorHandle('Unsplash App Access Key')
!credential.UNSPLASH_APP_SECRET && credentialErrorHandle('Unsplash App Secret')

credentialSuccessHandle()
