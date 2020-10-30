const request = require("supertest");
const app = require("../server/app");
const User = require("../models/Users");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

beforeEach(async () => {
  await User.deleteMany();
  await new User(testUser).save();
});

afterAll(() => {});

test("health check", async () => {
  await request(app)
    .get("/")
    .expect(200);
});

test("should able to create new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "John wayne",
      email: "slut1993@gmail.com",
      password: "Qwjqyx93"
    })
    .expect(201);

  //asset database was changed correctly:
  const user = response.body.newUser;
  const userId = await User.findById(user._id);
  expect(userId).not.toBeNull();

  //assertion about the response, eg password should be hashed
  expect(user.password).not.toBe("Qwjqyx93");
});

test("should able to login test user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: testUser.email,
      password: testUser.password
    })
    .expect(202);
});

test("should fail to login test user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "yeoo@gmail.com",
      password: testUser.password
    })
    .expect(400);
});

test("should not able to retrieve user profile when not authenticated", async () => {
  await request(app)
    .get("/users/me")
    .expect(401);
});

test("should  able to retrieve user profile when authenticated", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .expect(401);
});
