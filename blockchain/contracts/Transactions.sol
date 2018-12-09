pragma solidity ^0.4.14;

contract Verifier {
    function verifyProof(
        uint[2] a,
        uint[2] a_p,
        uint[2][2] b,
        uint[2] b_p,
        uint[2] c,
        uint[2] c_p,
        uint[2] h,
        uint[2] k,
        uint[3987] input
    ) public view returns (bool r) {}
}

contract Transactions{
    Verifier verifierContract;
    address public operator;

    modifier operatorOnly() {
        require(msg.sender == operator, "Only the operator can submit proofs.");
        _;
    }

    constructor(address _verifierContractAddr) public{
        verifierContract = Verifier(_verifierContractAddr);
        operator = msg.sender;
    }

    mapping(address => uint) balances;

    function deposit() public payable returns (uint) {
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

    function updateBalances(proof, input, newBalances) external operatorOnly {
        //TxProcessor logic
    }
}