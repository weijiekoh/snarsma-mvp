import * as generateTx from './generateTx';
import * as bigInt from 'big-integer'
const eddsa = require('../../circomlib/src/eddsa')
const babyJub = require('../../circomlib/src/babyjub')

const fromPrivKey = '0000000000000000000000000000000000000000000000000000000000000001';
const fromA = eddsa.prv2pub(fromPrivKey)
const fromPubKey = babyJub.packPoint(fromA)

const toPrivKey = '0000000000000000000000000000000000000000000000000000000000000002';
const toA = eddsa.prv2pub(toPrivKey)
const toPubKey = babyJub.packPoint(toA)

// tx to send eth from
let unsignedTx: generateTx.ITransaction = {
    from: fromPubKey,
    to: toPubKey,
    amount: bigInt(10),
    nonce: bigInt(4)
}

const sig = generateTx.signTx(unsignedTx, fromPrivKey)

generateTx.makeJson(unsignedTx,sig,fromA,'tx0')