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
    return hash(everything)
    // return everything
}


// function hash(leafHash){
//     // let emptyLeafHash = Buffer.from([0x6a, 0x38, 0xb7, 0x51, 0xf5, 0xc5, 0x12, 0x11, 0x5a, 0xab, 0x8e, 0xb4, 0x4a, 0xd1, 0x05, 0xe6, 0x8b, 0xeb, 0x5e, 0x1a, 0xf1, 0x51, 0x06, 0x77, 0x61, 0xbe, 0x3c, 0x96, 0xc6, 0xcf, 0x94, 0x07])
//     let emptyLeafHash = Buffer.from([0x1c, 0xe7, 0xd9, 0x46, 0x19, 0x63, 0xa7, 0xbe, 0x8d, 0x31, 0x2b, 0xca, 0x60, 0x17, 0xba, 0x5c, 0xd7, 0x81, 0x5a, 0xc6, 0xd7, 0xa5, 0x2e, 0x8b, 0xdf, 0x24, 0x72, 0x0b, 0x8f, 0x7c, 0xed, 0xa5])
//     // let twoEmptyLeavesHash = Buffer.from([0x47, 0xbf, 0xbf, 0xec, 0x84, 0x24, 0x12, 0xdb, 0xc0, 0x54, 0xcd, 0xeb, 0x4f, 0x0c, 0xe0, 0x28, 0x0b, 0xea, 0xda, 0x10, 0xf2, 0x35, 0x79, 0x3c, 0x92, 0x1c, 0x93, 0xa3, 0x92, 0xf1, 0x5f, 0x0b])
//     if (Buffer.compare(leafHash,Buffer.concat([emptyLeafHash,emptyLeafHash]))==0){
//         // console.log('empty')
//         return emptyLeafHash
//     }
//     else{
//         return pedersenHash(leafHash)
//     }
// }

function hash(leafBuffer){
    return pedersenHash(leafBuffer)
}


export {ILeaf, leafToHash, hash, MerkleTree}