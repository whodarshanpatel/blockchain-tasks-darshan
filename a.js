/* const { timeStamp } = require('console');
const { ethers } = require('ethers');
const providers = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/28ce60208dbf4adbb7ba05465f166e96"); */


/* async function abc() {
    const block = await providers.getBlock(12947044).then((result) => {
    console.log(JSON.stringify(result))
    })};
    abc() */


/* providers.getBlock(12947044).then((result) => {
    console.log(result);
});   */  


/* var Web3 = require('web3');
var provider = 'https://mainnet.infura.io/v3/28ce60208dbf4adbb7ba05465f166e96';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

web3.eth.getBlock(12947044).then((result) => {
  console.log(result);
});  */

/* class TransactionChecker {
    web3;
    account;

    constructor(projectId, account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + projectId));
    } */



var Web3 = require('web3');
var provider = 'https://mainnet.infura.io/v3/28ce60208dbf4adbb7ba05465f166e96';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);
var account = '0xc36Fde73DF24710Dfdd67e68B2873382e60daB0f'.toLowerCase();

async function checkBlocks(account) {
    for (let i = 12951875; i < 12951876; i++) {
        let block = await web3.eth.getBlock(i);
        let number = block.number
        console.log('serching block ' + number);
        console.log('current block have a ',block.transactions.length, 'transactions')
        if (block && block.transactions) {
            for (let txHash of block.transactions) {
                let tx = await web3.eth.getTransaction(txHash);

                if (account.toLowerCase() === tx.to.toLowerCase()) {
                    console.log(`Transaction found on block ${ number }`);
                    console.log(`Address is ${ tx.to }`);
                    console.log('value is ', web3.utils.fromWei(tx.value, 'ether'), ' Ether'),
                    console.log(`Timestamp is ${ new Date() }`)
                    
                }
            }
        } 
    }
};

checkBlocks(account)