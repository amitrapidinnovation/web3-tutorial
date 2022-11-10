solc = require("solc");
fs = require("fs");
Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

let fileContent = fs.readFileSync("demo.sol").toString();
console.log("6" , fileContent);

var input = {
    language: "Solidity",
    sources : {
        "demo.sol": {
            content: fileContent,
        },
    },
    
    settings : {
        outputSelection : {
            "*" : {
                "*" : ["*"],
            },
        },
    },
}

var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("26", output);

ABI = output.contracts["demo.sol"]["demo"].abi;
bytecode = output.contracts["demo.sol"]["demo"].evm.bytecode.object;

console.log("29 >>> abi:", ABI);
console.log("30 >>> bytecode:", bytecode);

contract = new web3.eth.Contract(ABI);

let defaultAccount;
web3.eth.getAccounts().then((accounts) => { 
   console.log("38 >>> Account:", accounts);
   defaultAccount = accounts[0];
   console.log("40 >>> defaultAccount:", defaultAccount);

   contract.deploy({data: bytecode}).send({from: defaultAccount,gas:500000}).on("receipt",(receipt) => {
    console.log("Contract address:", receipt.contractAddress);
   }).then((demoContract) => {
    demoContract.methods.x().call((err, data) => {
        console.log("initial:", data);
    });
   })
})