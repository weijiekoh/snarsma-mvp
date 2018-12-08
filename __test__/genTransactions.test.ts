import * as generateTx from '../user/generateTx'
import * as bigInt from 'big-integer'

describe('Transaction generation', () => {
  describe('Hashing', () => {
    let unsignedTx: generateTx.ITransaction

    beforeAll(() => {
      const fromPrivKey = '0000000000000000000000000000000000000000000000000000000000000001';
      const fromA = generateTx.A(fromPrivKey)
      const fromPubKey = generateTx.pubKey(fromA)

      const toPrivKey = '0000000000000000000000000000000000000000000000000000000000000002';
      const toA = generateTx.A(toPrivKey)
      const toPubKey = generateTx.pubKey(toA)
      unsignedTx = {
        from: fromPubKey,
        to: toPubKey,
        amount: bigInt(10),
        nonce: bigInt(4)
      }
    })

    test('should generate hash', () => {
      const h = generateTx.hashTx(unsignedTx)
      expect(h.length).toEqual(32)
      const expectedHex = '0000000000792a26bc24894f3255ba50f03c53382203d733577b45ffe5276424'
      expect(h.toString('hex')).toEqual(expectedHex)
    })
  })
})
