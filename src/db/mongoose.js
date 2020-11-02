require("dotenv").config();
const mongoose = require("mongoose");

let dbURL =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_TEST_URL
    : process.env.MONGODB_URL;

mongoose.connect(dbURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
