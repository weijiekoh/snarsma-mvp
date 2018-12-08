import * as txParser from '../operator/txParser'
import * as txProcessor from '../operator/txProcessor'
import * as bigInt from 'big-integer'
import {ILeaf, leafToHash, hashLeaf, MerkleTree} from '../operator/merkleTree'
import {numToBuf, pedersenHash} from '../utils/hash'
import retrieve from '../store/retrieve';


// initialise empty Merkle tree of depth 24c

let emptyLeaf: ILeaf = {
    pubKey: Buffer.allocUnsafe(32).fill(0),
    balance: bigInt(0),
    nonce: bigInt(0)
}

var elements = 2^16;
var leafArray = Array.apply(null, Array(elements)).map(function () { return emptyLeaf; });
//hash leaves
const leaves = leafArray.map(x => leafToHash(x))

//hash leaves and nodes to make Merkle tree
const tree = new MerkleTree(leaves, hashLeaf)
// console.log(tree)


let resPromise = retrieve.retrieveFromDb();
resPromise.then(response => {
  for( let tran of response){
    //   console.log(tran);
    let tx0Array = txParser.parseTx(tran);
  
    let tx0 = tx0Array[0]


    console.log(txProcessor.verify(tx0Array[1],tx0Array[2],tx0Array[3]))
    if (txProcessor.checkDeposit(tx0)){
    const leafIdx:number = txProcessor.updateDeposit(tx0)[0]
    let newLeaf = txProcessor.updateDeposit(tx0)[1]
    leafArray[leafIdx] = newLeaf
    console.log(leafArray[leafIdx])
}
  }
})


// //Alice deposit
// let tx0Path = '../../user/transactions/tx0.json'
// let tx0Array = txParser.parseTx(tx0Path)
// let tx0 = tx0Array[0]

// console.log(txProcessor.verify(tx0Array[1],tx0Array[2],tx0Array[3]))
// if (txProcessor.checkDeposit(tx0)){
//     const leafIdx:number = txProcessor.updateDeposit(tx0)[0]
//     let newLeaf = txProcessor.updateDeposit(tx0)[1]
//     leafArray[leafIdx] = newLeaf
//     console.log(leafArray[leafIdx])
// }

// //Alice transfer to Bob
// let tx1Path = '../../user/transactions/tx1.json'
// let tx1Array = txParser.parseTx(tx1Path)
// // console.log(tx1Array)
// // console.log(txProcessor.verify(tx1Array[1],tx1Array[2],tx1Array[3]))


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