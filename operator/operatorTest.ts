import * as txParser from '../operator/txParser'
import * as txProcessor from '../operator/txProcessor'
import * as bigInt from 'big-integer'
import {ILeaf, leafToHash, hash, MerkleTree} from '../operator/merkleTree'
import {numToBuf, pedersenHash} from '../utils/hash'
import retrieve from '../store/retrieve';
import * as generateTx from '../user/generateTx';
var fs = require("fs");
const zeroPrivKey = '0x0000000000000000000000000000000000000000000000000000000000000000'
const zeroA = generateTx.A(zeroPrivKey)
const zeroPubKey = generateTx.pubKey(zeroA)
const zeroIndex = txProcessor.getLeafIdx(zeroPubKey)
const stringifyBigInts = require('snarkjs/src/stringifybigint.js').stringifyBigInts;

// ---------------------------------------------------------------------------
// initialise empty Merkle tree of depth 3
//TODO: store empty tree somewhere so don't have to initialise every time
let emptyLeaf: ILeaf = {
    pubKey: Buffer.allocUnsafe(32).fill(0),
    balance: bigInt(0),
    nonce: bigInt(0)
}

// let emptyHash = leafToHash(emptyLeaf)
// let twoEmptyLeavesHash = hash(Buffer.concat([emptyHash,emptyHash]))

var elements = 2**8;
var leafArray = Array.apply(null, Array(elements)).map(function () { return emptyLeaf; });

// //hash leaves
const leaves = leafArray.map(x => leafToHash(x))

// //hash leaves and nodes to make Merkle tree
const tree = new MerkleTree(leaves, hash)
// console.log(tree.getRoot())

//---------------------------------------------------------------------------

//read transaction(s) from db

let resPromise = retrieve.retrieveFromDb();
resPromise.then(response => {
  for( let tran of response){
    // console.log(tran)
    let txArray = txParser.parseTx(tran);
    // console.log(txArray)
    let tx = txArray[0]

    if (txProcessor.checkDeposit(tx)){
      console.log('deposit')
      // console.log(tx)
      let newLeafIdx = txProcessor.updateDeposit(tx)[0]
      // console.log(newLeafIdx)
      let newLeaf = txProcessor.updateDeposit(tx)[1]
      // console.log(newLeaf)
      leafArray[newLeafIdx] = newLeaf
      console.log(leafArray[newLeafIdx])
    }
    else if (txProcessor.checkWithdraw(tx)){
      console.log('withdraw')
      let leafIdx = txProcessor.getLeafIdx(tx['from'])
      let newLeaf = txProcessor.updateWithdraw(tx,leafArray)
      leafArray[leafIdx] = newLeaf
      console.log(leafArray[leafIdx])
    }
    else{
      console.log('transfer')
      let fromLeafIdx = txProcessor.getLeafIdx(tx['from'])
      let toLeafIdx = txProcessor.getLeafIdx(tx['to'])
      let [newFromLeaf, newToLeaf] = txProcessor.updateTransfer(tx, leafArray)
      leafArray[fromLeafIdx] = newFromLeaf
      leafArray[toLeafIdx] = newToLeaf
      console.log(leafArray[fromLeafIdx])
      console.log(leafArray[toLeafIdx])
    }
  }
});

//     let txArray = txParser.parseTx(tran);
//     let tx = txArray[0]
//     let sig = txArray[]

//     let txFrom = tx['from']
//     let txTo = tx['to']
//     let txAmount = tx['amount']
//     let txNonce = tx['nonce']
//     // console.log(txFrom)

//     // if (txProcessor.checkDeposit(tx)){
//     //   // console.log(tx)
//       let newLeafIdx = txProcessor.updateDeposit(tx)[0]
//       // console.log(newLeafIdx)
//       let newLeaf = txProcessor.updateDeposit(tx)[1]
//       // console.log(newLeaf)
//       leafArray[newLeafIdx] = newLeaf
//       // console.log(leafArray[newLeafIdx])
//     // }

//     const leaves2 = leafArray.map(x => leafToHash(x)) 

//     const tree2 = new MerkleTree(leaves2, hash)

//     const proof = txProcessor.getMerkleProof(leaves2[newLeafIdx],tree2)
//     // console.log('proof')
//     // console.log(proof)

//     // console.log('new root')
//     // console.log(tree2.getRoot())

//     // console.log(txProcessor.verifyMerkleProof(proof,leaves2[newLeafIdx],tree2))

//   //JSON
//   let json = {
//     oldRoot: tree.getRoot().toString('hex'),
//     newRoot: tree2.getRoot().toString('hex'),
//     transaction: {
//       tx:{
//         from: txFrom,
//         to: txTo,
//         amount: txAmount,
//         nonce: txNonce,
//       }
//       sig:{

//       }
//     }
//     leaf: newLeaf,
//     leafHash: leafToHash(newLeaf).toString('hex'),
//     proof: proof
//   }

//   console.log(json)

//   fs.writeFile(
//     "./depositMerkleProof.json",
//     JSON.stringify(json),
//     (err) => {
//       if (err) {
//           console.error(err);
//           return;
//       }
//       console.log("File has been created")
//   });

//   }
// })

// // var leafArray = Array.apply(null, Array(elements)).map(function () { return emptyLeaf; });

// // //hash leaves


// // //     let fromLeafIdx = txProcessor.getLeafIdx(txFrom)
// // //     console.log(fromLeafIdx)
// // //     let fromLeafPubKey = leaves[fromLeafIdx].pubKey
// // //     let fromLeafBalance = leaves[fromLeafIdx].balance
// // //     let fromLeafNonce = leaves[fromLeafIdx].nonce

// // //     let toLeafIdx = txProcessor.getLeafIdx(txTo)
// // //     let toLeafPubKey = leaves[toLeafIdx].pubKey
// // //     let toLeafBalance = leaves[toLeafIdx].balance
// // //     let toLeafNonce = leaves[toLeafIdx].nonce

// // //     if (txProcessor.checkDeposit(tx)){
// // //       console.log(tx)
// // //       let newLeafIdx = txProcessor.updateDeposit(tx)[0]
// // //       let newLeaf = txProcessor.updateDeposit(tx)[1]
// // //       console.log(newLeafIdx)
// // //       leafArray[newLeafIdx] = newLeaf
// // //       console.log(leafArray[newLeafIdx])
// // //     }
// // //     else if (txProcessor.checkWithdraw(tx)){
// // //       console.log(txProcessor.updateWithdraw(tx,tree))

// // //       // let newLeaf = txProcessor.updateWithdraw(tx)
// // //       // leafArray[fromIdx] = newLeaf
// // //       // console.log(leafArray[leafIdx])
// // //     }
// // //     else{ //normal transfer

// // //     } 
// // //   }
// // // })

// // // // --------------------------------------------

// // // // //Alice deposit
// // // // let tx0Path = '../../user/transactions/tx0.json'
// // // // let tx0Array = txParser.parseTx(tx0Path)
// // // // let tx0 = tx0Array[0]

// // // // console.log(txProcessor.verify(tx0Array[1],tx0Array[2],tx0Array[3]))
// // // // if (txProcessor.checkDeposit(tx0)){
// // // //     const leafIdx:number = txProcessor.updateDeposit(tx0)[0]
// // // //     let newLeaf = txProcessor.updateDeposit(tx0)[1]
// // // //     leafArray[leafIdx] = newLeaf
// // // //     console.log(leafArray[leafIdx])
// // // // }

// // // // //Alice transfer to Bob
// // // // let tx1Path = '../../user/transactions/tx1.json'
// // // // let tx1Array = txParser.parseTx(tx1Path)
// // // // // console.log(tx1Array)
// // // // // console.log(txProcessor.verify(tx1Array[1],tx1Array[2],tx1Array[3]))


// // // // //dummy leaf data
// // // // //TODO: read transaction from database
// // // // //TODO: use merkleTreeHelper to convert transaction to updated leaf
// // // // const lhs1 = "0xSomeAddress1"
// // // // const rhs1 = "0,0"

// // // // const lhs2 = "0xSomeAddress2"
// // // // const rhs2 = "0,0"

// // // // //push new leaf onto leafArray
// // // // leafArray.push({lhs:lhs1,rhs:rhs1});
// // // // leafArray.push({lhs:lhs2,rhs:rhs2});

// // // // //hash leafArray
// // // // let leafArrayToHash = [];
// // // // leafArrayToHash.push(leafArray[i]['lhs']+leafArray[i]['rhs']);
// // // // for (let i in leafArray){
// // // // }
// // // // const leaves = leafArrayToHash.map(x => hashLeaf(x))

// // // // //regenerate Merkle tree with update leafArray 
// // // // const tree = new MerkleTree(leaves, hashLeaf)

// // // // console.log(tree)