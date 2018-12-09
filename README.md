# snarsma-mvp

Our submission for ETH Singapore 2018

## Motivation
We had planned to implement a simple version of an Ethereum sidechain based on zk-snarks. This sidechain would improve scalability by batching transactions into one snark proof to be validated on-chain. In theory, the performance costs of validating `n` transactions via a snark proof would be far lower than performing those `n` transactions on-chain. Additionally, the cryptographic security of snark proofs would eliminate the need for challenge mechanisms found in Plasma sidechain designs. 

![](https://i.imgur.com/YUEpWSe.png)

Our plan for the hackathon was to make the sidechain as simple as possible. It was based on [barryWhitehat's `roll_up` specification](https://hackmd.io/Sz3t1a4bRauXjhj1ZYzlBw#) and would only perform ETH transfers.

One significant motivation for picking this challenge was that the `circomlib` and `snarkjs` libraries by iden3 seemed mature and feature-complete enough for this task. In particular, `circomlib` came packaged with EdDSA signature validation, a Pederson snark-friendly hash function, and various bit manipulation components.

Ultimately, we did not complete a functioning demo, but implemented the following components:

- off-chain Merkle proof generation and validation, as well as state transition logic
- off-chain database which stores transactions and serves queries from an operator
- a zk-snark circuit that validates signed sidechain transactions

The piece whose implementation time and energy cost we had underestimated the most was the zk-snark circuit for validating a Merkle proof.

Nevertheless, we each learned a lot from this exercise and we plan to keep working on this project.

## Demo
Clone this repo and install dependencies by running `npm install`.
Run `tsc --watch` to get all our Typescript running

### Sending transactions and performing state transitions
Set up your database:
- create an empty directory on your machine
- initialise your db with `mongod --dbpath path/to/dir` 

Send transactions:
- from `build/user` run `node userTest.js` to send a deposit, transfer, and withdraw transaction to your database
- from `build/operator` run `node operatorTest.js` to pick up these transactions from your database and update your Merkle root accordingly

### Verifying eddsa signatures in the snark circuit
Download `jest` (`npm i jest`) if you do not already have it.
Run `jest Verify` to run a circuit which checks EdDSA-signed transactions.

