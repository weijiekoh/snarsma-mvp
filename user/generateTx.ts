const eddsa = require('../circomlib/src/eddsa')

const privKey = '0000000000000000000000000000000000000000000000000000000000000001';
const pubKey = eddsa.prv2pub(privKey)
console.log(pubKey)
