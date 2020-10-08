//CRUD
const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databse = "task-manager";

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true
  },
  (err, client) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("successfully connected");

    const db = client.db(databse);
    db.collection("users").insertOne({
      name: "Zeyu",
      age: 27
    });
  }
);
