include "../circomlib/circuits/eddsa.circom";
include "../circomlib/circuits/comparators.circom";
include "../circomlib/circuits/pedersen.circom";

template Snarsma(n) {
    /******************
    signal input merkleRoot[256];
    signal input merklePaths[n][32][256];
    *******************/

    /***** Signature ********/
    signal input txMsg[n][560];
    signal input txSigA[n][256];
    signal input txSigR8[n][256]
    signal input txSigS[n][256];
    
    signal input txNonce[n];

    // Transaction verification 
    // COMMENT OUT TO SPEED UP DEV
    // wire up each 'sub'-signal using a loop
    var i; var j; var k; var m; var ni;

    component eddsaVerifiers[n];
    for (ni=0; ni<n; ni++){
        eddsaVerifiers[ni] = EdDSAVerifier(560);

        for (i=0; i<560; i++) {
            eddsaVerifiers[ni].msg[i] <== txMsg[ni][i];
        }

        for (j=0; j<256; j++) {
            eddsaVerifiers[ni].A[j] <== txSigA[ni][j];
        }

        for (k=0; k<256; k++) {
            eddsaVerifiers[ni].R8[k] <== txSigR8[ni][k];
        }

        for (m=0; m<256; m++) {
            eddsaVerifiers[ni].S[m] <== txSigS[ni][m];
        }
        
    }

    var nj;
    component lt[n];
    for (nj=0; nj<n; nj++){
        lt[nj] = LessThan(32);
        lt[nj].in[0] <== txNonce[nj];
        lt[nj].in[1] <== 2147483647;
        lt[nj].out === 1;
    }

}

component main = Snarsma(3);
