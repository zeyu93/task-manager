const mongoose = require("mongoose");

let dbURL =
  process.env.NODNODE_ENV === "test"
    ? process.env.MONGODB_TEST_URL
    : process.env.MONGODB_URL;

console.log(dbURL);
mongoose.connect(dbURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
