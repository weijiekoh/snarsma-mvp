//npm i merkletreejs

const MerkleTree = require('merkletreejs');
const cryptoJs = require('crypto');

// lhs of a Leaf is eddsa address
// rhs of a Leaf is nonce and balance
type Leaf = {lhs: string, rhs: string};

// array of leaves
let leafArray: Leaf[] = [];

function sha256(data) {
    // returns Buffer
    return cryptoJs.createHash('sha256').update(data).digest()
}

//dummy leaf data
//TODO: read transaction from database
//TODO: use merkleTreeHelper to convert transaction to updated leaf
const lhs1 = "0xSomeAddress1"
const rhs1 = "0,0"

const lhs2 = "0xSomeAddress2"
const rhs2 = "0,0"

//push new leaf onto leafArray
leafArray.push({lhs:lhs1,rhs:rhs1});
leafArray.push({lhs:lhs2,rhs:rhs2});

//hash leafArray
let leafArrayToHash = [];
for (let i in leafArray){
    leafArrayToHash.push(leafArray[i]['lhs']+leafArray[i]['rhs']);
}
const leaves = leafArrayToHash.map(x => sha256(x))

//regenerate Merkle tree with update leafArray 
const tree = new MerkleTree(leaves, sha256)

console.log(tree)