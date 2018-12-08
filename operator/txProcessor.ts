const eddsa = require('../../circomlib/src/eddsa')
import * as bigInt from 'big-integer'
import * as generateTx from '../user/generateTx';
import {ILeaf, leafToBuffer, hashLeaf, MerkleTree} from '../operator/merkleTree'

const zeroPrivKey = '0x0000000000000000000000000000000000000000000000000000000000000000'
const zeroA = generateTx.A(zeroPrivKey)
const zeroPubKey = generateTx.pubKey(zeroA)

// check for deposit
function checkDeposit(transaction){
    return (Buffer.compare(transaction.from,zeroPubKey)==0)
}

// check for withdraw 
function checkWithdraw(transaction){
    return (Buffer.compare(transaction.to,zeroPubKey)==0)
}

//verify transaction signature
function verify(msg,sig,A){
    return eddsa.verify(msg,sig,A)
}

//verify Merkle membership
function leafIdxFromAddr(transaction): number{
    return parseInt(transaction.from.slice(0,2).toString('hex'),16)
}

function updateDeposit(transaction): any[]{
    let leafIdx = leafIdxFromAddr(transaction);
    let newLeaf : ILeaf = {
        pubKey: transaction.to,
        balance: transaction.amount,
        nonce: bigInt(1)
    }
    return [leafIdx, newLeaf]
}


//specify updates to from leaf


//specify updates to to leaf

export{
    verify, 
    checkWithdraw, 
    checkDeposit, 
    updateDeposit, 
    leafIdxFromAddr
}