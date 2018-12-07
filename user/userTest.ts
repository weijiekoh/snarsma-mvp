import * as generateTx from './generateTx';
import * as bigInt from 'big-integer'

const fromPrivKey = '0000000000000000000000000000000000000000000000000000000000000001';
const fromA = generateTx.A(fromPrivKey)
const fromPubKey = generateTx.pubKey(fromA)

const toPrivKey = '0000000000000000000000000000000000000000000000000000000000000002';
const toA = generateTx.A(toPrivKey)
const toPubKey = generateTx.pubKey(toA)

// tx to send eth from
let unsignedTx: generateTx.ITransaction = {
    from: fromPubKey,
    to: toPubKey,
    amount: bigInt(10),
    nonce: bigInt(4)
}

const sig = generateTx.signTx(unsignedTx, fromPrivKey)

generateTx.makeJson(unsignedTx,sig,fromA,'tx0')