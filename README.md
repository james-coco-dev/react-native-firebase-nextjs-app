# Gratitude

This is the main repo for the Gratitude app. Each piece of the app is a package within this repo. The app is organized as a monorepo to keep files easily searchable and in-sync.

Each package has installation instructions within its own `README.md` file.

The main mobile app resides in `gratitude-mobile`, which is a React Native app. As of February 2019, the app is optimized for iOS and may not be functional on Android.

The website is `gratitude-web`, which uses Nextjs for React server-side rendering.

The main backend of the app is `gratitude-firebase-api`, which handles all of the database hooks and serverless functions. It's possible that the app will need a server at some point, but Firebase should be able to handle the backend for the foreseeable future.

## TODO

- [ ] Apple Pay

## Deployment

You must add the person who should be able to deploy to Zeit.

https://zeit.co/teams/invite/zqmavenL

Connect to your GitHub account if you have one, otherwise sign up with email.

When asked to connect to a GitHub project, skip.

Install `now` with `npm i -g now`

Run `now switch`. Log in if you have not already. Switch to `gratitude`.