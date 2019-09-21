# Gratitude Charity Mobile

This is the mobile version of Gratitude that is focused on charity.

Certificate issues:

https://stackoverflow.com/questions/52852140/apple-pay-payment-certificate-is-not-trusted

Helpful guide:

https://github.com/sidimansourjs/applepay-token

https://aaronmastsblog.com/blog/apple-pay-certificates/

> openssl ecparam -out private.key -name prime256v1 -genkey


> openssl pkcs12 -in ApplePayCert.p12 -out ApplePayCert.pem -nocerts -nodes

> openssl x509 -inform DER -outform PEM -in apple_pay.cer -out apple_pay.pem

https://developers.braintreepayments.com/guides/apple-pay/server-side/node

## Installation

Run the following commands to install everything.

```
npm i
`cd ios && pod install`
```

## Development

To run in the simulator, run `npm run ios`.

**NOTE:** if you're running locally, you will need to run `npm run dev` from within `gratitude-firebase-api/functions` beacuse this package will use the local endpoints by default.