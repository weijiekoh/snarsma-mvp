import * as bigInt from 'big-integer'
import * as snarkjs from 'snarkjs'
import {buffer2bits} from '../utils/data'
import {numToBuf, bufToNum, pedersenHash} from '../utils/hash'
const babyJub = require("../../circomlib/src/babyjub.js");

describe('Merkle proofs on chain', () => {
  describe('Hashing', () => {

    test('should calculate a chain of hashes', () => {
      const circuitDef = require('../../circuits/merkle.json')
      const circuit = new snarkjs.Circuit(circuitDef)
 
      const leaf = Buffer.from("00010203040506070809", "hex");
      const leafH = pedersenHash(leaf)

      const leaf2 = Buffer.from("11111111111111111111", "hex")
      const leaf2H = pedersenHash(leaf2)
      
      const node1 = Buffer.from("22222222222222222222", "hex")

      const hash1 = pedersenHash(node1)

      const root = pedersenHash(
        Buffer.concat([
          pedersenHash(
            Buffer.concat([
              leafH,
              leaf2H
            ])
          ),
          hash1
        ])
      )
      //root = hash(hash(hash(leaf) + hash2H) + hash1)

      const input = {
        'leaf': buffer2bits(leaf),
        'proofHash[0]': buffer2bits(leafH),
        'proofHash[1]': buffer2bits(leaf2H),
        'proofHash[2]': buffer2bits(hash1)
      }

      const w = circuit.calculateWitness(input)

      const xout = w[circuit.getSignalIdx("main.out0")];
      const yout = w[circuit.getSignalIdx("main.out1")];
      const out = w[circuit.getSignalIdx("main.out1")];

      const hP = babyJub.unpackPoint(leafH)
      console.log(xout.toString(16))
      console.log(yout.toString(16))

      const concatOut = w[circuit.getSignalIdx("main.concatOut")];
      console.log(concatOut.toString())

      expect(xout).toEqual(hP[0])
      expect(yout).toEqual(hP[1])

      expect(circuit.checkWitness(w)).toBeTruthy()
    })
  })
})

