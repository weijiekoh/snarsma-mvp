import DbClient = require("./DbClient");
class Retrieve {
    public async retrieveFromDb() {
   
        let allTransactions ;
        let db = await DbClient.connect();
        let count = await db.collection("transaction").find({"status":"UN"}).count();
        // if(count>=4){
             return await db.collection("transaction").find({"status":"UN"}).limit(4).toArray();
            // console.log(allTransactions);
            // console.log('------');
          
            // for (let entry of allTransactions) {
            //     console.log(entry._id); 
            //    let res = await db.collection("transaction").updateOne({"_id": entry._id}, 
            //     {"$set": {"status": "PC"}});
                
            // }
            
        // }
    }

    public async updateProcessed(transactions){
    let db = await DbClient.connect();
     for (let entry of transactions) {
                console.log(entry._id); 
               let res = await db.collection("transaction").updateOne({"_id": entry._id}, 
                {"$set": {"status": "PC"}});
                
            }
    }

}

export default new Retrieve();