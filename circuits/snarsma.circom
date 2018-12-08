include "../circomlib/circuits/eddsa.circom";

template Snarsma() {
    signal input msg[560];
    signal input A[256];
    signal input R8[256]
    signal input S[256];

    component eddsaVerifier = EdDSAVerifier(560);
    
    // wire up each 'sub'-signal using a loop
    var i; var j; var k; var m;
    for (i=0; i<560; i++) {
        eddsaVerifier.msg[i] <== msg[i];
    }

    for (j=0; j<256; j++) {
        eddsaVerifier.A[j] <== A[j];
    }

    for (k=0; k<256; k++) {
        eddsaVerifier.R8[k] <== R8[k];
    }

    for (m=0; m<256; m++) {
        eddsaVerifier.S[m] <== S[m];
    }
}

component main = Snarsma();
