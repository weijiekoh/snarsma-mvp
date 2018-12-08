const eddsa = require('../../circomlib/src/eddsa')
import * as bigInt from 'big-integer'
import * as generateTx from '../user/generateTx';
import {ILeaf, leafToHash, hash, MerkleTree} from '../operator/merkleTree'

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

//get merkle proof
function getMerkleProof(leaf, tree){
    let proof = tree.getProof(leaf)
    return proof
}

//verify merkle proof
function verifyMerkleProof(proof, leaf, tree){
    let root = tree.getRoot()
    let verified = tree.verify(proof, leaf, root)
    return verified
}

//get leaf index from public key
function getLeafIdx(pubKey): number{
    return parseInt(pubKey.slice(0,1).toString('hex'),16)
}

//update after deposit is made
function updateDeposit(transaction): any[]{
    let newLeafIndex = getLeafIdx(transaction.to)
    let newLeaf : ILeaf = {
        pubKey: transaction.to,
        balance: transaction.amount,
        nonce: bigInt(1)
    }
    return [newLeafIndex,newLeaf]
}

//update after withdraw is made
function updateWithdraw(transaction, leafArray) {
    let leafIndex = getLeafIdx(transaction.from)
    // console.log(leafIndex)
    let fromLeaf = leafArray[leafIndex]

    if ((fromLeaf.balance).greaterOrEquals(transaction.amount) 
        && (bigInt(transaction.nonce).subtract(fromLeaf.nonce)).equals(1)){
        // console.log(oldLeaf)
        // console.log(oldLeaf.balance)
        let newFromLeaf: ILeaf = {
            pubKey: transaction.from,
            balance: bigInt(fromLeaf.balance).subtract(transaction.amount),
            nonce: transaction.nonce
        }
        return newFromLeaf
    }
    else{
        return "Invalid withdrawal."
    }
}

//update after transfer is made
function updateTransfer(transaction, leafArray) {
    let toLeafIdx = getLeafIdx(transaction.to)
    let fromLeafIdx = getLeafIdx(transaction.from)
    let toLeaf = leafArray[toLeafIdx]
    let fromLeaf = leafArray[fromLeafIdx]

    if ((fromLeaf.balance).greaterOrEquals(transaction.amount) 
         && (bigInt(transaction.nonce).subtract(fromLeaf.nonce)).equals(1)){
        let newFromLeaf: ILeaf = {
            pubKey: transaction.from,
            balance: bigInt(fromLeaf.balance).subtract(transaction.amount),
            nonce: transaction.nonce
        }
        let newToLeaf: ILeaf = {
            pubKey: transaction.to,
            balance: bigInt(toLeaf.balance).add(transaction.amount),
            nonce: toLeaf.nonce
        }
        return [newFromLeaf, newToLeaf]
    }
    else{
        return "Invalid transaction."
    }
}

export{
    verify,  
    getMerkleProof,
    verifyMerkleProof,
    checkDeposit, 
    checkWithdraw,
    updateDeposit,
    updateWithdraw,
    updateTransfer,
    getLeafIdx
}