import * as txParser from '../operator/txParser'
import * as txProcessor from '../operator/txProcessor'
import * as bigInt from 'big-integer'
import {ILeaf, leafToHash, hash, MerkleTree} from '../operator/merkleTree'
import retrieve from '../store/retrieve';

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

console.log('\ninitialising empty leaves...\n')
var elements = 2**8;
var leafArray = Array.apply(null, Array(elements)).map(function () { return emptyLeaf; });

//hash leaves
console.log('hashing empty leaves...\n')
var leaves = leafArray.map(x => leafToHash(x))

//hash leaves and nodes to make Merkle tree
console.log('intialising Merkle tree...\n')
var tree = new MerkleTree(leaves, hash)

//---------------------------------------------------------------------------

//read transaction(s) from db

let txCount = 0
let resPromise = retrieve.retrieveFromDb();
resPromise.then(response => {
  for( let tran of response){

    txCount ++;

    let leafIdx = 0;

    console.log('current Merkle root:')
    console.log(tree.getRoot())
    console.log('\n')

    console.log('received transaction ', txCount,'\n')
    let txArray = txParser.parseTx(tran);
    let tx = txArray[0]

    //Check if tx is deposit
    if (txProcessor.checkDeposit(tx)){
      console.log('transaction is deposit')
      leafIdx = txProcessor.updateDeposit(tx)[0]
      let newLeaf = txProcessor.updateDeposit(tx)[1]
      console.log('transaction is legit \n')
      leafArray[leafIdx] = newLeaf
      console.log('new toLeaf:', leafArray[leafIdx],'\n')
    }

    //Check if tx is withdraw
    else if (txProcessor.checkWithdraw(tx)){
      console.log('transaction is withdraw')
      leafIdx = txProcessor.getLeafIdx(tx['from'])
      let newLeaf = txProcessor.updateWithdraw(tx,leafArray)
      console.log('transaction is legit \n')
      leafArray[leafIdx] = newLeaf
      console.log('new fromLeaf:', leafArray[leafIdx],'\n')
    }

    //Check if tx is transfer
    else{
      console.log('transaction is transfer')
      leafIdx = txProcessor.getLeafIdx(tx['from'])
      let toLeafIdx = txProcessor.getLeafIdx(tx['to'])
      let [newLeaf, newToLeaf] = txProcessor.updateTransfer(tx, leafArray)
      console.log('transaction is legit \n')
      leafArray[leafIdx] = newLeaf
      leafArray[toLeafIdx] = newToLeaf
      console.log('new fromLeaf:', leafArray[leafIdx],'\n')
      console.log('new toLeaf:', leafArray[toLeafIdx],'\n')
    }

    // //hash leaves
    leaves = leafArray.map(x => leafToHash(x))

    console.log('updating Merkle tree...\n')
    // //hash leaves and nodes to make Merkle tree
    tree = new MerkleTree(leaves, hash)

    //Generate new Merkle root
    console.log('updated Merkle root:')
    console.log(tree.getRoot())
    console.log('\n')

    console.log(leaves[0])

    //Provide Merkle Proof of new 'from' leaf
    let proof = txProcessor.getMerkleProof(leaves[leafIdx], tree)
    console.log('Merkle proof of transaction ', txCount, '\n\n', proof)
    console.log('\n')

    //Verify Merkle Proof
    console.log('verification of new leaf in new Merkle root...')
    let verify = txProcessor.verifyMerkleProof(proof,leaves[leafIdx],tree)
    console.log(verify)
    console.log('\n')

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