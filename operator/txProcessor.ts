const eddsa = require('../../circomlib/src/eddsa')

//verify transaction signature
function verify(msg,sig,A){
    return eddsa.verify(msg,sig,A)
}

//specify updates to from leaf

//specify updates to to leaf

export{verify}