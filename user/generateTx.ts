import {hashBuf, numToBuf} from '../utils/hash'
import * as bigInt from 'big-integer'
const eddsa = require('../../circomlib/src/eddsa')
const babyJub = require('../../circomlib/src/babyjub')
var fs = require("fs");

const fromPrivKey = '0000000000000000000000000000000000000000000000000000000000000001';
const fromPubKey = babyJub.packPoint(eddsa.prv2pub(fromPrivKey))

const toPrivKey = '0000000000000000000000000000000000000000000000000000000000000002';
const toPubKey = babyJub.packPoint(eddsa.prv2pub(toPrivKey))

interface ITransaction {
  from: Buffer,
  to: Buffer,
  amount: bigInt.BigInteger,
  nonce: bigInt.BigInteger,
}

const hashTx = (tx: any): Buffer => {
  // get the first 24 bytes of each pubkey
  const fromPubKeyForHash = tx.from.slice(0, 24)
  const toPubKeyForHash = tx.to.slice(0, 24)

  //Nonce is 4 bytes
  const nonceBytes = numToBuf(bigInt(tx.nonce), 4)

  //Amount is 2 bytes
  const amtBytes = numToBuf(bigInt(tx.amount), 2)

  // Concat everything
  const everything = Buffer.alloc(54)
  for (let i = 0; i < 2; i++) {
    everything[53-i] = amtBytes[2-i]
  }

  for (let i = 0; i < 4; i++) {
    everything[51-i] = nonceBytes[4-i]
  }

  for (let i = 0; i < 24; i++) {
    everything[47-i] = toPubKeyForHash[23-i]
  }

  for (let i = 0; i < 24; i++) {
    everything[23-i] = fromPubKeyForHash[23-i]
  }

  // console.log(fromPubKeyForHash.toString('hex'))
  // console.log(toPubKeyForHash.toString('hex'))
  // console.log(nonceBytes.toString('hex'))
  // console.log(amtBytes.toString('hex'))

  return numToBuf(hashBuf(everything), 32)
}

// tx to send eth from
let unsignedTx: ITransaction = {
  from: fromPubKey,
  to: toPubKey,
  amount: bigInt(10),
  nonce: bigInt(4)
}

const signTx = (unsignedTx: ITransaction, privKey: string): any => {
  const hashedTx = hashTx(unsignedTx)
  const sig = eddsa.sign(privKey, hashedTx)
  return sig
}

const sig = signTx(unsignedTx, fromPrivKey)

//make JSON object
var tx0 = {
  tx: {
    from: unsignedTx.from.toString('hex'),
    to: unsignedTx.to.toString('hex'),
    amount: unsignedTx.amount.toString(),
    nonce: unsignedTx.nonce.toString()
  },
  sig: {
    R8: sig.R8.toString(),
    S: sig.S.toString()
  }
};

fs.writeFile("../../user/transactions/tx0.json", JSON.stringify(tx0), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});


export {hashTx, signTx, ITransaction}
