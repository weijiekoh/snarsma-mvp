import * as generateTx from '../user/generateTx'
import * as bigInt from 'big-integer'

describe('Transaction generation', () => {
  describe('Hashing', () => {
    let unsignedTx: generateTx.ITransaction
    let fromPrivKey = '0000000000000000000000000000000000000000000000000000000000000001';
    let fromA = generateTx.A(fromPrivKey)
    let fromPubKey = generateTx.pubKey(fromA)

    let toPrivKey = '0000000000000000000000000000000000000000000000000000000000000002';
    let toA = generateTx.A(toPrivKey)
    let toPubKey = generateTx.pubKey(toA)

    beforeAll(() => {
      unsignedTx = {
        from: fromPubKey,
        to: toPubKey,
        amount: bigInt(10),
        nonce: bigInt(4)
      }
    })

    test('should combine fields correctly', () => {
      const h = generateTx.combineTx(unsignedTx)
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
})
