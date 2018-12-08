//npm i merkletreejs
import {numToBuf, pedersenHash} from '../utils/hash'
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
function leafToHash(leaf: ILeaf){

    const pubKeyForHash = leaf.pubKey

    //Nonce is 4 bytes
    const nonceBytes = numToBuf(bigInt(leaf.nonce), 4)
    
    //Amount is 2 bytes
    const balanceBytes = numToBuf(bigInt(leaf.balance), 2)
    
    const everything = Buffer.alloc(38)
    for (let i = 0; i < 2; i++) {
        everything[37-i] = balanceBytes[2-i]
    }
    
    for (let i = 0; i < 4; i++) {
        everything[35-i] = nonceBytes[4-i]
    }
    
    for (let i = 0; i < 32; i++) {
        everything[31-i] = pubKeyForHash[31-i]
    }
    return hashLeaf(everything)
    // return everything
}


function hashLeaf(leafBuffer){

    let emptyLeafBuffer =  Buffer.allocUnsafe(38).fill(0)
    let emptyLeafHash = Buffer.from([0x1c, 0xe7, 0xd9, 0x46, 0x19, 0x63, 0xa7, 0xbe, 0x8d, 0x31, 0x2b, 0xca, 0x60, 0x17, 0xba, 0x5c, 0xd7, 0x81, 0x5a, 0xc6, 0xd7, 0xa5, 0x2e, 0x8b, 0xdf, 0x24, 0x72, 0x0b, 0x8f, 0x7c, 0xed, 0xa5])
    if (Buffer.compare(leafBuffer,emptyLeafBuffer)==0){
        return emptyLeafHash
    }
    else{
        return pedersenHash(leafBuffer)
    }
    
}

// function hashLeaf(leafBuffer){

//     return pedersenHash(leafBuffer)
    
// }


export {ILeaf, leafToHash, hashLeaf, MerkleTree}