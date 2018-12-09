### Application-specific blockchain
The PoC will use a Proof of Authority application-specific blockchain with full compatibility with the Ethereum stack. Future iterations will use the plasma specification to peg the sidechain to the public Ethereum mainnet, providing public accountability while retaining high transaction speeds. 

Approved package sales will be cryptographically signed by the seller and committed to the blockchain, thus providing a source of truth from which the database verifies the authenticity of its records. Confirmed packages will also be represented as ERC721 tokens, with token ownership transferred to the buyer.

We use a [Parity PoA sidechain](https://wiki.parity.io/Demo-PoA-tutorial) and an [etherchain-light block explorer](https://github.com/gobitfly/etherchain-light).  

Dependencies:
- Parity: 
  - For Ubuntu users, or Mac users with Homebrew installed, use the one-line binary installer `bash <(curl https://get.parity.io -L)`.
  - Otherwise, refer to the guide at https://wiki.parity.io/Setup.

Demo:

1. Clone this repo:
- `git clone https://github.com/akombalabs/CISP`

2. Open a new Terminal window and start the PoA chain. If you're curious, the settings for the PoA chain is in the file `node0.toml`:
- `cd CISP/blockchain/parity-poa-node`
- `parity --config node0.toml`

3. Open a new Terminal window and build the block explorer:
- `git clone https://github.com/akombalabs/etherchain-light --recursive`
- `cd etherchain-light`
  - **Docker build:**
    - If you don't have Docker, install it at https://docs.docker.com/install/.
    - `sudo docker build -t etherchain-light .`
    - `sudo docker run --net="host" -p "3000:3000" etherchain-light`
  - **Local build:**
    - Have `node@8.7.0` and `npm@5.4.2` on your system
    - `npm install`
    - `npm start`
- Navigate to http://localhost:3000 in your favourite browser to see the block explorer UI.

4. Make a transaction on the PoA chain from user account to signer account. This transaction should be immediately processed and show up in your browser.
- `curl --data '{"jsonrpc":"2.0","method":"personal_sendTransaction","params":[{"from":"0x004ec07d2329997267Ec62b4166639513386F32E","to":"0xfe7e660c642f05529febb827737bbf2dc96223a2","value":"0xde0b6b3a7640000"}, "user"],"id":0}' -H "Content-Type: application/json" -X POST localhost:8450`

5. Compile and migrate contracts.
- From the `/blockchain` directory, run
  - `truffle compile`
  - `find . -name '.DS_Store' -type f -delete` to get rid of any pesky .DS_Store files
  - `truffle migrate --reset`
- Take note of the contract addresses of `Users: 0x...` and `Records: 0x...` in your terminal output.

6. Instantiate and interact with contracts
- Open the script `/blockchain/script.js`, where a list of commands for interacting with contract instances can be found. These commands are to be used in the node console.
  - in `script.js`, replace `var usersAddr = '0x...'` with the Users address from your terminal output;
  - in `script.js`, replace `var recordsAddr = '0x...'` with the Records address from your terminal output.
- `node` to enter your node console.
- Copy and paste the commands from `script.js` into your node console to see the contract method calls and event logs.
