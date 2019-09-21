var x509 = require('x509')
var fs = require('fs')
var crypto = require('crypto')
var forge = require('node-forge')
const path = require('path')

const PRIVATE_KEY_PATH = path.join(__dirname, '../credentials/ApplePayKey.pem')
const CERT_PATH = path.join(__dirname, '../credentials/apple_pay.pem')

function extractMerchantID (cert) {
  try {
    var info = x509.parseCert(cert)

    return info.extensions['1.2.840.113635.100.6.32'].substr(2)
  } catch (e) {
    console.error('Unable to extract merchant ID from certificate ' + CERT_PATH)
  }
}

function generateSharedSecret (merchantPrivateKey, ephemeralPublicKey) {
  let om
  let ecdh = crypto.createECDH('prime256v1')
  const foo = ((Buffer.from(merchantPrivateKey, 'base64')).toString('hex'))
  const bar = foo.substring(14, 64 + 14)

  console.log('foo', foo)
  console.log('bar', bar)
  ecdh.setPrivateKey(bar, 'hex') // 14: Key start, 64: Key length

  console.log(ecdh)

  try {
    om = ecdh.computeSecret(((Buffer.from(ephemeralPublicKey, 'base64')).toString('hex')).substring(52, 130 + 52), 'hex', 'hex') // 52: Key start, 130: Key length
  } catch (e) {
    console.log(e)
    return e
  }

  return om
}

function generateSymmetricKey (merchantId, sharedSecret) {
  const KDF_ALGORITHM = String.fromCharCode(0x0D) + 'id-aes256-GCM'
  const KDF_PARTY_V = (Buffer.from(merchantId, 'hex')).toString('binary')
  const KDF_INFO = KDF_ALGORITHM + 'Apple' + KDF_PARTY_V

  let hash = crypto.createHash('sha256')
  hash.update(Buffer.from('000000', 'hex'))
  hash.update(Buffer.from('01', 'hex'))
  hash.update(Buffer.from(sharedSecret, 'hex'))

  // From nodejs V6 use --> hash.update(KDF_INFO, 'binary');
  hash.update(KDF_INFO, 'binary')

  return hash.digest('hex')
}

function decryptCiphertext (symmetricKey, ciphertext) {
  const SYMMETRIC_KEY = forge.util.createBuffer((Buffer.from(symmetricKey, 'hex')).toString('binary'))
  const IV = forge.util.createBuffer((Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toString('binary'))
  const CIPHERTEXT = forge.util.createBuffer(forge.util.decode64(ciphertext))

  let decipher = forge.cipher.createDecipher('AES-GCM', SYMMETRIC_KEY)
  var tag = forge.util.decode64('')

  decipher.start({
    iv: IV,
    tagLength: 0,
    tag: tag
  })

  decipher.update(CIPHERTEXT)
  decipher.finish()
  return (Buffer.from(decipher.output.toHex(), 'hex').toString('utf-8'))
}

/**
 * Decrypts the crazy thing that apple gives from apple pay
 *
 * @param {Object} token - paymentData from the react native apple pay
 */
const decrypt = (token) => {
  var pk = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8')
  var cut = '-----BEGIN PRIVATE KEY-----'
  var cutEnd = '-----END PRIVATE KEY-----'
  var start = pk.indexOf(cut) + cut.length + 1
  var end = pk.indexOf(cutEnd) - start - 1
  var key = pk.substr(start, end)
  var cert = fs.readFileSync(CERT_PATH, 'utf8')

  console.log('key time', key)

  // token
  const ephemeralPublicKey = token.header.ephemeralPublicKey

  // Generating shared Secret
  let sharedSecret = generateSharedSecret(key, ephemeralPublicKey)

  console.log('sharedSecret', sharedSecret)

  // Generating symmetricKey Key
  var merchantId = extractMerchantID(cert)

  console.log('merchantId', merchantId)

  let symmetricKey = generateSymmetricKey(merchantId, sharedSecret)

  console.log('symmetricKey', symmetricKey)

  var ciphertext = token.data

  console.log('ciphertext', ciphertext)

  // Decrypt Cipher text
  let decrypted = decryptCiphertext(symmetricKey, ciphertext)

  console.log('decrypted', decrypted)

  console.log(decrypted)
  var decryptedClean = decrypted.slice(0, -14)
  console.log(decryptedClean)
}

module.exports = {
  decryptApplePay: decrypt
}
