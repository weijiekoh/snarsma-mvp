import * as crypto from 'crypto' 
import * as bigInt from 'big-integer'

const hashBuf = (buf: Buffer): bigInt.BigInteger => {
  const hash = crypto.createHash("sha256").update(buf).digest("hex")
  const r = hash.slice(10);

  return bigInt(r, 16)
}

const hashNum = (num: bigInt.BigInteger): bigInt.BigInteger => {
  //@ts-ignore TS2304
  const buf = numToBuf(num)
  const hash = crypto.createHash("sha256").update(buf).digest("hex")
  const r = hash.slice(10);

  return bigInt(r, 16)
}

//@ts-ignore TS2304
const numToBuf = (num: bigInt.BigInteger, length: number): Buffer => {
  //@ts-ignore TS2304
  const buf = Buffer.alloc(length)

  //@ts-ignore TS2345
  const n = Array.from(num.toArray(256).value)

  while (n.length < 32) {
    n.unshift(0)
  }

  for (let i = 0; i < n.length; i++) {
    buf[length - 1 - i] = n[31-i]
  }

  return buf
}

export {hashBuf, numToBuf}
