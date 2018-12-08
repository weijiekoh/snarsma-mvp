import * as bigInt from 'big-integer'
import {numToBuf} from '../utils/hash'
const eddsa = require('../../circomlib/src/eddsa')
const babyJub = require('../../circomlib/src/babyjub')
var fs = require("fs");

interface ITransaction {
  from: Buffer,
  to: Buffer,
  amount: bigInt.BigInteger,
  nonce: bigInt.BigInteger,
}

interface ISignature {
  R8: bigInt.BigInteger[],
  S: bigInt.BigInteger
}

const txToBuf = (tx: any): Buffer => {
  // Output should be 2 + 4 + 32 + 32 = 70 bytes long
  ////// get the first 24 bytes of each pubkey
  //const fromPubKeyForHash = tx.from.slice(0, 24)
  //const toPubKeyForHash = tx.to.slice(0, 24)

  // Nonce is 4 bytes
  const nonceBytes = numToBuf(bigInt(tx.nonce), 4)

  // Amount is 2 bytes
  const amtBytes = numToBuf(bigInt(tx.amount), 2)

  // Concat everything
  let j = 70 - 1
  const everything = Buffer.alloc(70)
  for (let i = 0; i < 2; i++) {
    everything[j-i] = amtBytes[2-i]
  }

  j -= 2

  for (let i = 0; i < 4; i++) {
    everything[j-i] = nonceBytes[4-i]
  }

  j -= 4

  const addrLen = 32
  for (let i = 0; i < addrLen; i++) {
    everything[j-i] = tx.to[addrLen-1-i]
  }
  
  j -= 32

  for (let i = 0; i < addrLen; i++) {
    everything[j-i] = tx.from[addrLen-1-i]
  }

  return everything
}

const signTx = (unsignedTx: ITransaction, privKey: string): ISignature => {
  const tx = txToBuf(unsignedTx)
  const sig = eddsa.sign(privKey, tx)
  return sig
}

const verifyTx = (tx: any, signature: ISignature, pubkeyA: any) => {
  const msg = txToBuf(tx)
  return eddsa.verify(msg, signature, pubkeyA)
}

// TODO: rename to generateEddsaPubkey
function A(privKey){
  return eddsa.prv2pub(privKey)
}

// TODO: rename to encodeEddsaPubkey
function pubKey(A){
  return babyJub.packPoint(A)
}

//make JSON object
function makeJson(_unsignedTx, _sig, _A, fileName){
  var transaction = {
    tx: {
      from: _unsignedTx.from,
      to: _unsignedTx.to,
      amount: _unsignedTx.amount.toString(),
      nonce: _unsignedTx.nonce.toString()
    },
    sig: {
      R8: _sig.R8.toString(),
      S: _sig.S.toString()
    },
    A: _A.toString()
  }

  fs.writeFile(
    "../../user/transactions/" + fileName + ".json",
    JSON.stringify(transaction),
    (err) => {
      if (err) {
          console.error(err);
          return;
      }
      console.log("File has been created")
  });
}

export {txToBuf, verifyTx, signTx, ITransaction, makeJson, A, pubKey}
