import * as generateTx from '../user/generateTx'
import {numToBuf, pedersenHash} from '../utils/hash'
import * as bigInt from 'big-integer'

describe('Transaction generation', () => {
  let fromPrivKey = '0000000000000000000000000000000000000000000000000000000000000001';
  let fromA = generateTx.A(fromPrivKey)
  let fromPubKey = generateTx.pubKey(fromA)

  let toPrivKey = '0000000000000000000000000000000000000000000000000000000000000002';
  let toA = generateTx.A(toPrivKey)
  let toPubKey = generateTx.pubKey(toA)
  let unsignedTx: generateTx.ITransaction = {
    from: fromPubKey,
    to: toPubKey,
    amount: bigInt(10),
    nonce: bigInt(4)
  }

  describe('Signing transactions', () => {

    test('should combine fields correctly', () => {
      const h = generateTx.txToBuf(unsignedTx)
      expect(h.length).toEqual(70)
      const expectedHex = '47366cc622498a3aa7653d6cba655f2bdc84a6b25665cbce8f88972a9469ea9816ba17cdbbc90d2ecb22d7d4b363678c8f5dd670bf56694bf8d032ce072f85af000004000a00'
      expect(h.toString('hex')).toEqual(expectedHex)
    })

    test('should sign and verify with EdDSA', () => {
      const signature = generateTx.signTx(unsignedTx, fromPrivKey)
      const verified = generateTx.verifyTx(unsignedTx, signature, fromA)
      expect(verified).toBeTruthy()
    })
  })

  describe('Hashing data', () => {
    test('should perform a pedersen hash', () => {
      const h = pedersenHash(generateTx.txToBuf(unsignedTx))
      expect(h.toString('hex')).toEqual('49158d61489be5251dc2530d872c849765e409c70393d2a6623e6cc618b93114')
    })
  })
})
