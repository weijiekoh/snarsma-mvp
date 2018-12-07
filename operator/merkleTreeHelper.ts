//read in transaction JSON from database
const fs = require('fs');
const eddsa = require('../../circomlib/src/eddsa')
import * as bigInt from 'big-integer'

let tx0 = JSON.parse(fs.readFileSync('../../user/transactions/tx0.json'));  

let tx = tx0.tx
let from = Buffer.from(tx.from.data)
console.log(from)
let to = Buffer.from(tx.to.data)
console.log(to)
let nonce = tx.nonce
let amount = tx.amount

let rawSig = tx0.sig

let R8 = rawSig.R8
let R8_0 = bigInt(R8.split(',')[0]).value
let R8_1 = bigInt(R8.split(',')[1]).value
let S = bigInt(rawSig.S).value
let sig = {R8:[R8_0,R8_1],S:S}

let eddsaVerify = tx0.eddsaVerify

let msg = Buffer.from(eddsaVerify.msg.data)
let rawA = eddsaVerify.A
let A_x = bigInt(rawA.split(',')[0]).value
let A_y = bigInt(rawA.split(',')[1]).value
let A = [A_x,A_y]

//verify transaction is signed properly
console.log(eddsa.verify(msg,sig,A))

//specify updates to from leaf

//specify updates to to leaf