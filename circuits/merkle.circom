include "../circomlib/circuits/pedersen.circom";
include "../circomlib/circuits/bitify.circom";
include "./buffers.circom";

template MerkleProof(n) {
    signal input leaf[80];
    signal input proofHash[n][256];
    /*signal input root[256];*/

    signal output out0;
    signal output out1;
    signal output concatOut;

    // Hash the leaf
    component leafHasher = Pedersen(80);
    for (var i=0; i<80; i++) {
        leaf[i] --> leafHasher.in[i];
    }
    var leafHash0 = leafHasher.out[0];
    var leafHash1 = leafHasher.out[1];
    
    out0 <-- leafHash0;
    out1 <-- leafHash1;
    
    component n2b0 = Num2Bits(256);
    n2b0.in <-- leafHash0;

    component n2b1 = Num2Bits(256);
    n2b1.in <-- leafHash1;

    // Concatenate the two halves
    component concat = Concat(256);
    for (var m=0; m<256; m++){
        concat.a[m] <== n2b0.out[m];
        concat.b[m] <== n2b1.out[m];
    }

    component b2n0 = Bits2Num(256);
    for (var j=0; j<256; j++){
        b2n0.in[j] <== concat.out[j];
    }
    concatOut <-- b2n0.out;

    /*// proofHashes start from the bottom of the tree and end at the top*/
    /*component hasher[];*/
    /*var k;*/
    /*var h;*/
    /*for (var j=0; j<n; j++) {*/
        /*hasher = Pedersen(512);*/

        /*for (k=0; k<256; k++){*/
            /*hasher.in[k] <-- proofHash[n][k];*/
        /*}*/

    /*}*/


    /*for (var i=0; i<n; i++){*/
        /*pedersen = Pedersen();*/
    /*}*/
}

component main = MerkleProof(3);
