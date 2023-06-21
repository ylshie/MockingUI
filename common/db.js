import * as mongoDB from "mongodb";
//var ObjectId = require('mongodb').ObjectID;
const  ObjectID = require('mongodb').ObjectId;
//const DB_CONN_STRING    = "mongodb://localhost:27017"
const mode              = process.env.MODE;
//const DB_NAME           = (mode == "public")? "gptdemo": "chatgpt";
const DB_NAME           = "gptdemo"
const COL_CONTEXT       = "context"

function openDB() {
    const connect   = process.env.DB_CONN_STRING;
    const client    = new mongoDB.MongoClient(connect);
    const db = client.db(DB_NAME);
    //const collection = db.collection(COL_CONTEXT);
    //console.log("db", db, "col", collection);
    
    return db;
}

export async function addContext(name, text) {
    const db = openDB();
    const collection = db.collection(COL_CONTEXT);
    var record = { name: name, text: text };
    const res = await collection.insertOne(record);
    console.log("1 record ", record, " inserted res=", res);

    return res;
}


export async function delContext(id) {
    const db = openDB();
    const collection = db.collection(COL_CONTEXT);
    const search = { _id: new ObjectID(id) };
    const res = await collection.deleteOne( search )    ;
//    console.log("1 record ", record, " inserted res=", res);

    return res;
}


export async function updateContext(id, name, text) {
    const db = openDB();
    const collection = db.collection(COL_CONTEXT);
    const search = { _id: new ObjectID(id) };
    const record = { name: name, text: text };
    const res = await collection.updateOne(search, {$set: record});
    //console.log("1 record ", record, " inserted res=", res);

    return res;
}

export async function listContext() {
    const db    = openDB();
    const col   = db.collection(COL_CONTEXT);
    const res   = col.find({});
    const data  = (res) ? await res.toArray(): null;

    console.log("listContext", data)

    return data;
}
