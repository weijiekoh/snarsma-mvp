import { MongoClient, Db } from "mongodb";

class DbClient {

    public db: Db;

    public async connect() {
        // async / await approach:
        this.db = await MongoClient.connect("mongodb://localhost:27018/transactions");
        //  this.db = await MongoClient.connect("mongodb://hitesh:joshi@snarsma-shard-00-00-gzrfu.mongodb.net:27017,snarsma-shard-00-01-gzrfu.mongodb.net:27017,snarsma-shard-00-02-gzrfu.mongodb.net:27017/snarks?ssl=true&replicaSet=snarsma-shard-0&authSource=admin&retryWrites=true");
        
        return this.db;
    }
}

export = new DbClient();

