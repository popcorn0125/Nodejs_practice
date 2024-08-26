const { MongoClient } = require('mongodb');
// MongoDB Atalas 네트워크 접속
const uri = "mongodb+srv://user:1234@cluster0.ltnh5.mongodb.net/myDatabase";
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db("testdb");
        const collection = database.collection("testcol");
        // 새 문서 저장
        const doc = { name: "김준식", age: 25 };
        const result = await collection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        // 저장 된 문서 가져 오기
        const query = { _id: result.insertedId };
        const fetch = await collection.findOne(query);
        console.log("Fetched document:", fetch);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
