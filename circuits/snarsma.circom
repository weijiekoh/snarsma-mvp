include "../circomlib/circuits/eddsa.circom";
include "../circomlib/circuits/comparators.circom";

template Snarsma(n) {
    // Signature inputs
    /*signal input merkleRoot[256];*/
    signal input msg[n][560];
    signal input A[n][256];
    signal input R8[n][256]
    signal input S[n][256];
    
    signal input nonce[n];

    // Transaction verification 
    // COMMENT OUT TO SPEED UP DEV
    // wire up each 'sub'-signal using a loop
    var i; var j; var k; var m; var ni;

    /********************************************
    component eddsaVerifiers[n];
    for (ni=0; ni<n; ni++){
        eddsaVerifiers[ni] = EdDSAVerifier(560);

        for (i=0; i<560; i++) {
            eddsaVerifiers[ni].msg[i] <== msg[ni][i];
        }

        for (j=0; j<256; j++) {
            eddsaVerifiers[ni].A[j] <== A[ni][j];
        }

        for (k=0; k<256; k++) {
            eddsaVerifiers[ni].R8[k] <== R8[ni][k];
        }

        for (m=0; m<256; m++) {
            eddsaVerifiers[ni].S[m] <== S[ni][m];
        }
        
    }
    ********************************************/

    var nj;
    component lt[n];
    for (nj=0; nj<n; nj++){
        lt[nj] = LessThan(32);
        lt[nj].in[0] <== nonce[nj];
        lt[nj].in[1] <== 2147483647;
        lt[nj].out === 1;
    }

}

component main = Snarsma(3);
