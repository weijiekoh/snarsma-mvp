import DbClient = require("./DbClient");
const getTransactions = () => {
    return [
        {"from": "0x94DF32fCF96817d203D4E629c5F9CD12BBDF927E","to": "0xAe72A48c1a36bd18Af168541c53037965d26e4A8","nonce": 12312, "amount": 123, "signature": "object","status":"UN"},
        {"from": "0x94DF32fCF96817d203D4E629c5F9CD12BBDF927E","to": "0xAe72A48c1a36bd18Af168541c53037965d26e4A8","nonce": 12312, "amount": 123, "signature": "object","status":"UN"},
        {"from": "0x94DF32fCF96817d203D4E629c5F9CD12BBDF927E","to": "0xAe72A48c1a36bd18Af168541c53037965d26e4A8","nonce": 12312, "amount": 123, "signature": "object","status":"UN"},
        {"from": "0x94DF32fCF96817d203D4E629c5F9CD12BBDF927E","to": "0xAe72A48c1a36bd18Af168541c53037965d26e4A8","nonce": 12312, "amount": 123, "signature": "object","status":"UN"},
        {"from": "0x94DF32fCF96817d203D4E629c5F9CD12BBDF927E","to": "0xAe72A48c1a36bd18Af168541c53037965d26e4A8","nonce": 12312, "amount": 123, "signature": "object","status":"UN"},
        {"from": "0x94DF32fCF96817d203D4E629c5F9CD12BBDF927E","to": "0xAe72A48c1a36bd18Af168541c53037965d26e4A8","nonce": 12312, "amount": 123, "signature": "object","status":"UN"},
        {"from": "0x94DF32fCF96817d203D4E629c5F9CD12BBDF927E","to": "0xAe72A48c1a36bd18Af168541c53037965d26e4A8","nonce": 12312, "amount": 123, "signature": "object","status":"UN"}

];
}


export const insertSingleTransaction = async (transaction) => {
    try {
        // connect to db
        let db = await DbClient.connect();
        await db.collection("transaction").deleteMany({});
         await db.collection("transaction").insertOne(transaction);
    } catch (error) {
        console.log(error);
        console.log("Unable to connect to db");
        return error;
        
    }
}

export const insertMultiTransaction = async (transactions?) => {
    if(!transactions)
    {
        transactions = getTransactions();
    }
    try {
        // connect to db
        let db = await DbClient.connect();
        await db.collection("transaction").deleteMany({});
         await db.collection("transaction").insertMany(transactions);
    } catch (error) {
        console.log(error);
  
        return error;
        
        
    }
}

