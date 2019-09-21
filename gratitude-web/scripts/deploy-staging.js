const shell = require('shelljs')
const chalk = require('chalk')
const credential = require('../lib/credential')
const env = require('../staging.now.json').build.env

// TODO if all credentials are present, run this
credentialSuccessHandle = () => {
  shell.echo(chalk.greenBright('*****************************************'))
  shell.echo(chalk.greenBright('****** CHECK CREDENTIALS SUCCESS! *******'))
  shell.echo(chalk.greenBright('*****************************************'))
  shell.exec('now --target production -A staging.now.json')
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
// Check Firebase Credentials in staging.now.json
!env.API_KEY && credentialErrorHandle('Firebase Staging API key')
!env.AUTH_DOMAIN && credentialErrorHandle('Firebase Staging Auth Domain')
!env.DATABASE_URL && credentialErrorHandle('Firebase Staging Database URL')
!env.PROJECT_ID && credentialErrorHandle('Firebase Staging Project Id')
!env.STORAGE_BUCKET && credentialErrorHandle('Firebase Staging Storage Bucket')
!env.MESSAGING_SENDER_ID &&
  credentialErrorHandle('Firebase Staging Messaging Sender Id')

// Check Other API Credentials in the credential.js
!credential.ALGOLIA_APPLICATION_ID &&
  credentialErrorHandle('Algolia Application Id')
!credential.ALGOLIA_SEARCH_ONLY_API_KEY &&
  credentialErrorHandle('Algolia Search Only API Key')
!credential.ALGOLIA_DEV_INDEX_NAME &&
  credentialErrorHandle('Algolia Development Indexname')
!credential.STRIPE_PUBLISH_KEY_TEST &&
  credentialErrorHandle('Stripe Publish Test Key')
!credential.PLAID_PUBLIC_KEY_TEST &&
  credentialErrorHandle('Plaid Public Test Key')
!credential.PLAID_DEV_ENV && credentialErrorHandle('Plaid Development ENV')
!credential.UNSPLASH_APP_ACCESS_KEY &&
  credentialErrorHandle('Unsplash App Access Key')
!credential.UNSPLASH_APP_SECRET && credentialErrorHandle('Unsplash App Secret')

credentialSuccessHandle()
