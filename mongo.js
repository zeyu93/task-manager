//CRUD
const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

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
    db.collection("tasks").updateMany({
      completed: true
    }, {
      $set: {
        completed: false
      }
    }).then((result)=>{
      const {modifiedCount , matchedCount} = result
      console.log(`there was ${matchedCount} and we sucessfully modielfed ${matchedCount}`)
    })
  }
);
