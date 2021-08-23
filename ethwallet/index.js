const mysql = require("mysql2");

const db = mysql
  .createConnection({
    host: "localhost", // HOST NAME
    user: "root", // USER NAME
    database: "ethwallet", // DATABASE NAME
    password: "root", // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

const ethers = require('ethers');
const Wallet = ethers.Wallet;
const utils = ethers.utils;
const providers = ethers.providers;  

var activeIndex = 0;
const mnemonic = "jealous badge vivid must emerge vacuum now urge various apology quantum brick latin riot hungry"

function generatePath() {
    const standardPath = "m/44'/60'/0'/0";
    const index = activeIndex++; 
    const path = `${standardPath}/${index}`;
    console.log('++',path)
    return path;
} 


function addtodb(account) {
    return new Promise(function (resolve, reject) {
        const sqlQuery1 = `INSERT INTO data (address, privatekey) VALUES ('${account.address}', '${account.privateKey}')`
        console.debug("sqlQuery1", sqlQuery1);
        db.query(sqlQuery1,
            function (error, result) {
        //console.debug(error, result);
        if (error || !result) { 
            console.error('[DB] error while address insert.');
            return reject(error);
        } else {
            console.debug('[DB] address inserted into table affectedRows:', result.affectedRows);
            return resolve(result.affectedRows);
        }

        }
        )
    }
    )}
function createWallet() {
    for (let i = 1; i < 10; i++) {
        const path = generatePath();
        const account = ethers.Wallet.fromMnemonic(mnemonic, path);
        console.log(account.address)
        addtodb(account)
        //return;
    }  
} createWallet() 



// import ethers.js
const ethers = require('ethers')
// network: using the Rinkeby testnet
//let network = 'https://rinkeby.infura.io/v3/28ce60208dbf4adbb7ba05465f166e96'
//let network = 'https://goerli.infura.io/v3/28ce60208dbf4adbb7ba05465f166e96'
let network = 'https://ropsten.infura.io/v3/28ce60208dbf4adbb7ba05465f166e96'
// provider: Infura or Etherscan will be automatically chosen
let provider = ethers.getDefaultProvider(network)
// Sender private key: 
// correspondence address 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
let privateKey = '0xf5d0d9a018d8d633aa25d8c7ef94635aaea0e0210560e11056941fc28c52df42'
// Create a wallet instance
var wallet = new ethers.Wallet(privateKey, provider)
// Receiver Address which receives Ether
let receiverAddress = '0x0054ad5f32A9682Bba1B164480B8cbEe76A25D91'
// Ether amount to send
let amountInEther = '0.00'
// Create a transaction object
let tx = {
    to: receiverAddress,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther(amountInEther)
}
const address = '0xbA2B737E5ee5E2564b2A816E5e6e4b9846C30668'
provider.getBalance(address).then((balance) => {
    // convert a currency unit from wei to ether
    const balanceInEth = ethers.utils.formatEther(balance)
    console.log(`balance: ${balanceInEth} ETH`)
   })

   provider.getTransactionReceipt("0x592072ab1444b28f209ebadea036995385f61601d31b73342288b6bc3acd4bd7").then((rec) => {
    console.log(rec)
   }) 

wallet.sendTransaction(tx)
.then((txObj) => {
   console.log('txHash', txObj.hash)
})