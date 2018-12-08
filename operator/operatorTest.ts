import * as txParser from '../operator/txParser'
import * as txProcessor from '../operator/txProcessor'
import * as bigInt from 'big-integer'
import {ILeaf, leafToHash, hashLeaf, MerkleTree} from '../operator/merkleTree'

// initialise empty Merkle tree of depth 24

let emptyLeaf: ILeaf = {
    pubKey: Buffer.allocUnsafe(32).fill(0),
    balance: bigInt(0),
    nonce: bigInt(0)
}

console.log(leafToHash(emptyLeaf))

var elements = 2**16;
var leafArrayToHash = Array.apply(null, Array(elements)).map(function () { return emptyLeaf; });
console.log(leafArrayToHash)

const leaves = leafArrayToHash.map(x => leafToHash(x))
console.log(leaves)
const tree = new MerkleTree(leaves, hashLeaf)

// console.log(tree)

// let tx0Path = '../../user/transactions/tx0.json'
// let tx1Path = '../../user/transactions/tx1.json'

// let tx0Array = txParser.parseTx(tx0Path)
// console.log(txProcessor.verify(tx0Array[1],tx0Array[2],tx0Array[3]))

// let tx1Array = txParser.parseTx(tx1Path)
// console.log(txProcessor.verify(tx1Array[1],tx1Array[2],tx1Array[3]))


// //dummy leaf data
// //TODO: read transaction from database
// //TODO: use merkleTreeHelper to convert transaction to updated leaf
// const lhs1 = "0xSomeAddress1"
// const rhs1 = "0,0"

// const lhs2 = "0xSomeAddress2"
// const rhs2 = "0,0"

// //push new leaf onto leafArray
// leafArray.push({lhs:lhs1,rhs:rhs1});
// leafArray.push({lhs:lhs2,rhs:rhs2});

// //hash leafArray
// let leafArrayToHash = [];
// leafArrayToHash.push(leafArray[i]['lhs']+leafArray[i]['rhs']);
// for (let i in leafArray){
// }
// const leaves = leafArrayToHash.map(x => hashLeaf(x))

// //regenerate Merkle tree with update leafArray 
// const tree = new MerkleTree(leaves, hashLeaf)

// console.log(tree)