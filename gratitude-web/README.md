# Gratitude Web

This app is connected to Firebase and uses the Context API for managing store state.

https://blog.bitsrc.io/react-context-api-a-replacement-for-redux-6e20790492b3

Firebase handles user information in a way that is not always intuitive. The `firebase.auth()` service only handles auth and really has nothing to do with the user account system, even though it might feel like it does. In order to add data to user accounts, you need to create a separate user account system in Firestore. [This article](https://bigcodenerd.org/create-user-profile-firestore-authentication/) explains how to do it.

Use Callable functions when possible (https://firebase.google.com/docs/functions/callable) as they make endpoint security much easier and cuts down on boilerplate.

## Quirks

Everything is `display: flex; flex-direction: column;` by default

There is a lot of extra tooling necessary to get Firebase to work with Next, mostly because Firebase was not built to work with universal apps:

https://github.com/zeit/next.js/issues/6073

## Installation

`npm i`

## Deployment

`npm run deploy`