# Gratitude Firebase API

This handles the bulk of the workload for the app

## Installation

The default Firebase Functions template places everything within the `/functions` directory, so you have to enter that directory to add and install packages. Pretty much everything you do will be within the `/functions` directory.

`cd functions && npm i`

## Directory Structure

```s
functions
  |-- credentials # this is where the credentials for firebase and twilio live. you'll need the files to get things running
  |-- lib # any reusable utility functions go here
  |-- services # all serverless endpoints and hooks go here
```

## Development

You can run this locally by running `npm run dev` from within the `/functions` directory. This will serve your functions locally. Any interface that you use can now attach to this local endpoint by adding the `useFunctionsEmulator` method:

```js
// https://stackoverflow.com/questions/50884534/how-to-test-functions-https-oncall-firebase-cloud-functions-locally
export const functions = firebase.functions().useFunctionsEmulator('http://localhost:5000')
```

This is not currently set up to happen programmatically based on environment, so you'll have to change it manually.

## Deployment

`firebase deploy` deploys everything, `npm run deploy` from within `/functions` deploys just the functions.

## Specs

Using Plaid for bank account verification

Using Dwolla for ACH transfers

Twilio for sending text messages

## Thoughts

We have ACH set up with auto-account verification

We don't necessarily want to automatically make the transfer. We want to manage an account balance internally before we transfer, but we can probably use a company account as an intermediary?

`Peer 1 => Gratitude Account => Peer 2`

We'll want to do this because it might be some time before `Peer 2` collects the money given by `Peer 1`.

Schema:

```s
users {
  email: String
  dwollaAccountId: String
}

transactions {
  sourceId: String # The Id of the user who initiated the transfer
  recipientId: String # The Id of the recipient
  createdAt: DateTime
}
```

## TODO

We should use Twilio verify to verify phone numbers. We should consider at what step we want to add that level of friction.

https://www.twilio.com/console/verify/getting-started/build

Need to figure out if we want to support "send to email". This isn't hard to implement, but does require some extra work.