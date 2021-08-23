const mysql = require("mysql2");

const db = mysql
  .createConnection({
    host: "localhost", // HOST NAME
    user: "root", // USER NAME
    database: "blockchain", // DATABASE NAME
    password: "root", // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });


var Web3 = require('web3');
var provider = 'https://mainnet.infura.io/v3/28ce60208dbf4adbb7ba05465f166e96';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);
//var account = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'.toLowerCase();

 function getLastSyncedBlock() {
     return new Promise(function (resolve, reject) {
      db.query(`SELECT number from blocks ORDER BY number DESC LIMIT 1`,
        function (error, result) {
          // console.debug(error, result);
          if (error || !result) {
            console.error('[DB] errored in getting latest block.');
            return reject(error);
          } else if (result.length == 0) {
            console.debug(`[DB] there is no any block.`);
            return resolve(0);
          } else {
            console.log(result)
            console.debug('[DB] got the last processed block', result[0].number);
            return resolve(result[0].number);
          }
        });
    });
};

function checkaddress(adr) {
    return new Promise(function (resolve, reject) {
        console.log(adr)
        db.query(`SELECT address from addres WHERE address = '${adr}'`,
          function (error, result) {
            //console.debug(error, result);
            if (result.length == 0) {
              //console.debug(`[DB] there is no any address.`);
              return resolve(false);
            } else {
              //console.log(result)
              //console.debug('address:', result[0]);
              return resolve(true);
            }
          });
      });
}


 async function insertBlocksandtrans() {
    var x =  await getLastSyncedBlock(); 
    const b = await web3.eth.getBlockNumber()
    console.log('letest block number ',b)
    for (let i = x; i < b; i++) {
        let block = await web3.eth.getBlock(i);
        let number = block.number
        //console.log(block)
        console.log('serching block ' + number);
        console.log('current block have a ',block.transactions.length, 'transactions')  
        if (block && block.transactions) {
            for (let txHash of block.transactions) {
                let tx = await web3.eth.getTransaction(txHash);
                //console.log(tx)
                var account = await checkaddress(tx.to)
                if (account) {
                    console.log(`Transaction found on block ${ number }`);
                    console.log(`Address is ${ tx.to }`);
                    console.log('value is ', web3.utils.fromWei(tx.value, 'ether'), ' Ether'),
                    console.log(`Timestamp is ${ new Date() }`)
                    const sqlQuery2 = "INSERT INTO transactions (`hash`,`blockNumber`,`BlockHash`,`from`,`to`,`amount`,`gasPrice`,`gas`,`nonce`,`transactionIndex`) VALUES ";
                    const sqlQuery3 = sqlQuery2 + `('${tx.hash}', '${tx.blockNumber}', '${tx.blockHash}', '${tx.from}', '${tx.to}', '${web3.utils.fromWei(tx.value)}', '${tx.gasPrice}', '${tx.gas}', '${tx.nonce}', '${tx.transactionIndex}')`
                    db.query(sqlQuery3,
                        function (error, result) {
                        // console.debug(error, result);
                            if (error || !result) {
                            console.error('[DB] error while Transaction insert.');
                            return reject(error);
                            } else {
                            console.debug('[DB] Transaction inserted into table, affectedRows:', result.affectedRows);
                            return (result.affectedRows);
                        }   })        
                }         
             }
        }       
        const sqlQuery1 = `INSERT INTO blocks (number, hash, parentHash, blockTimestamp) VALUES ('${block.number}', '${block.hash}', '${block.parentHash}','${block.timestamp}')`
            console.debug("sqlQuery1", sqlQuery1);
            db.query(sqlQuery1,
                function (error, result) {
            // console.debug(error, result);
            if (error || !result) { 
                console.error('[DB] error while Block insert.');
                return reject(error);
            } else {
                console.debug('[DB] Block inserted into table affectedRows:', result.affectedRows);
                return (result.affectedRows);
            }

            }
            )    
     } 
}; insertBlocksandtrans() 
    


/* function insertTransaction(block,number) {         
    if (block && block.transactions) {
        for (let txHash of block.transactions) {
            let tx = web3.eth.getTransaction(txHash);
            console.log(tx)
            let account = db.query(`SELECT address from addres`)
            console.log(account)
            if (account.toLowerCase() === tx.to.toLowerCase()) {
                console.log(`Transaction found on block ${ number }`);
                console.log(`Address is ${ tx.to }`);
                console.log('value is ', web3.utils.fromWei(tx.value, 'ether'), ' Ether'),
                console.log(`Timestamp is ${ new Date() }`)
                const sqlQuery2 = "INSERT INTO transactions (`hash`,`blockNumber`,`confirmations`,`from`,`to`,`amount`,`gasPrice`,`gasLimit`,`nonce`,`data`,`blockTimestamp`) VALUES ";
                const sqlQuery3 = sqlQuery2 + `('${transaction.hash}', '${transaction.blockNumber}', '${transaction.confirmations}', '${transaction.from}', '${transaction.to}', '${transaction.amount}', '${transaction.gasPrice}', '${transaction.gasLimit}', '${transaction.nonce}', '${transaction.data}','${transaction.blockTimestamp}')`
                db.query(sqlQuery3,
                    function (error, result) {
                    // console.debug(error, result);
                        if (error || !result) {
                        console.error('[DB] error while Transaction insert.');
                        return reject(error);
                        } else {
                        console.debug('[DB] Transaction inserted into table, affectedRows:', result.affectedRows);
                        return resolve(result.affectedRows);
                    }   })        
            }           
        }
    }      
};  */