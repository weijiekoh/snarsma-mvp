// Concatenate two n-sized bit arrays

template Concat(n) {
    signal input a[n];
    signal input b[n];
    signal output out[n];

    for (var i=0; i<n; i++) {
        out[i] <== a[i];
        /*out[j + n] <== b[j];*/
    }
}
