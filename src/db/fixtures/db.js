require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const testUserId = new mongoose.Types.ObjectId();

const testUser = {
  _id: testUserId,
  name: "John Cena",
  email: "john@cena.com",
  password: "Qwjqyx93",
  tokens: [
    {
      token: jwt.sign({ _id: testUserId }, process.env.JWT_TOKEN_SECRET)
    }
  ]
};

const seedDB = async () => {
  await User.deleteMany();
  await new User(testUser).save();
};

module.exports = {
  testUser,
  testUserId,
  seedDB
};
