//npm i merkletreejs
import {hashBuf, numToBuf} from '../utils/hash'
import * as bigInt from 'big-integer'

const MerkleTree = require('merkletreejs');
// const cryptoJs = require('crypto');

// lhs of a Leaf is eddsa address
// rhs of a Leaf is nonce and balance

interface ILeaf {
    pubKey: Buffer,
    balance: bigInt.BigInteger,
    nonce: bigInt.BigInteger,
}

//hash leaf for leaf lookup
function leafToBuffer(leaf: ILeaf){
    // get the first 24 bytes of leaf pubkey
    const pubKeyForHash = leaf.pubKey.slice(0, 24)

    //Nonce is 4 bytes
    const nonceBytes = numToBuf(bigInt(leaf.nonce), 4)
    
    //Amount is 2 bytes
    const balanceBytes = numToBuf(bigInt(leaf.balance), 2)
    
    // Concat everything
    const everything = Buffer.alloc(30)
    for (let i = 0; i < 2; i++) {
        everything[29-i] = balanceBytes[2-i]
    }
    
    for (let i = 0; i < 4; i++) {
        everything[27-i] = nonceBytes[4-i]
    }
    
    for (let i = 0; i < 24; i++) {
        everything[23-i] = pubKeyForHash[23-i]
    }
    return everything
}


function hashLeaf(leafBuffer){
//TODO: Change to Pedersen hash (Zcash)
    return numToBuf(hashBuf(leafBuffer), 32)
}

export {ILeaf, leafToBuffer, hashLeaf, MerkleTree}