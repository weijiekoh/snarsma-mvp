import * as bigInt from 'big-integer'

function buffer2bits(buff) {
  const res = [];
  for (let i=0; i<buff.length; i++) {
    for (let j=0; j<8; j++) {
      if ((buff[i]>>j)&1) {
        res.push(bigInt.one);
      } else {
        res.push(bigInt.zero);
      }
    }
  }
  return res;
}

export {buffer2bits}
