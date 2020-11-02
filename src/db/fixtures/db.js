require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const Task = require("../../models/Tasks");

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

const testUserTwoId = new mongoose.Types.ObjectId();
const testUserTwo = {
  _id: testUserTwoId,
  name: "Dime Cena",
  email: "Dime@cena.com",
  password: "Qwjqyx93",
  tokens: [
    {
      token: jwt.sign({ _id: testUserTwoId }, process.env.JWT_TOKEN_SECRET)
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  task_desc: "task one",
  completed: false,
  owner: testUserTwoId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  task_desc: "task two",
  completed: false,
  owner: testUserTwoId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  task_desc: "task three",
  completed: false,
  owner: testUserId
};

const seedDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(testUser).save();
  await new User(testUserTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  testUser,
  testUserTwo,
  testUserId,
  testUserTwoId,
  seedDB,
  taskOne
};
