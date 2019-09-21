# Gratitude Mobile

[![Build status](https://build.appcenter.ms/v0.1/apps/96ff4f87-275f-4e3a-8bdf-6f0d18e6e24e/branches/master/badge)](https://appcenter.ms)

The mobile app for Gratitude

This is built with standard React Native installation

## Installation

`npm i`

NOTE: Do not run `react-native link` or everything will break. React Native is fun like that.

## Directory Structure

```s
android # native android stuff lives here
components # reusable components live here
ios # native ios stuff lives here
lib # reusable functions and utilities live here
screens # any screen that is routed to lives here
static # static assets live here
```

## Development

`npm run ios` or `npm run android`, though you need a special setup to get the android simulator working.
`npm run dev` aliases to `npm run ios`.

Press `Command + D` to show dev tools

## Deployment

The app automatically deploys via [App Center](https://appcenter.ms), but can also be deployed manually via TestFlight.

## TODO

add splash screen to android:

https://github.com/crazycodeboy/react-native-splash-screen

add permissions for android contacts:

https://github.com/rt2zz/react-native-contacts

It seems all you have to do is never run `react-native link`?

Need fake contacts in your simulator?

https://stackoverflow.com/questions/31926500/how-to-get-fake-contacts-in-ios-simulator

https://stripe.com/blog/accept-ach-payments

https://dashboard-sandbox.dwolla.com/applications-legacy

Plaid API - to get bank account and routing info

https://stackoverflow.com/questions/29708660/plaid-api-transfer-funds-between-accounts

When dealing with certificates, this might be helpful:

https://docs.microsoft.com/en-us/appcenter/build/ios/uploading-signing-files

- [ ] handle phone auth. maybe just use auth0 and a custom token instead of firebase?