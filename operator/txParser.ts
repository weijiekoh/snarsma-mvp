//read in transaction JSON from database
const fs = require('fs');
import * as bigInt from 'big-integer'
import * as generateTx from '../user/generateTx';

//parse transaction

// function parseTx(path){
//     let tx0 = JSON.parse(fs.readFileSync(path));  

//     let tx = tx0.tx
//     const from = Buffer.from(tx.from.data)
//     const to = Buffer.from(tx.to.data)
//     const amount = bigInt(tx.amount).value
//     const nonce = bigInt(tx.nonce).value

//     let rawSig = tx0.sig
//     let R8 = rawSig.R8
//     let R8_0 = bigInt(R8.split(',')[0]).value
//     let R8_1 = bigInt(R8.split(',')[1]).value
//     let S = bigInt(rawSig.S).value
//     let sig = {R8:[R8_0,R8_1],S:S}

//     let rawA = tx0.A
//     let A_x = bigInt(rawA.split(',')[0]).value
//     let A_y = bigInt(rawA.split(',')[1]).value
//     let A = [A_x,A_y]

//     //verify transaction is signed properly

//     let transaction: generateTx.ITransaction = {
//         from: from,
//         to: to,
//         amount: amount,
//         nonce: nonce
//     }

//     let msg = generateTx.txToBuf(transaction)

//     return [transaction, msg,sig,A]
// }

function parseTx(trans){
  
    let tx0 = trans;
   
    let tx = tx0.tx

    const from = Buffer.from(tx.from.buffer)
    const to = Buffer.from(tx.to.buffer)
    const amount = bigInt(tx.amount).value
    const nonce = bigInt(tx.nonce).value

    let rawSig = tx0.sig
    let R8 = rawSig.R8
    let R8_0 = bigInt(R8.split(',')[0]).value
    let R8_1 = bigInt(R8.split(',')[1]).value
    let S = bigInt(rawSig.S).value
    let sig = {R8:[R8_0,R8_1],S:S}

    let rawA = tx0.A
    let A_x = bigInt(rawA.split(',')[0]).value
    let A_y = bigInt(rawA.split(',')[1]).value
    let A = [A_x,A_y]

    //verify transaction is signed properly

    let transaction: generateTx.ITransaction = {
        from: from,
        to: to,
        amount: amount,
        nonce: nonce
    }

    let msg = generateTx.txToBuf(transaction)

    return [transaction, msg,sig,A]
}

export {parseTx}
