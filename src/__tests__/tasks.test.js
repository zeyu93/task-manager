const request = require("supertest");
const app = require("../server/app");
const Task = require("../models/Tasks");
const { testUser, testUserId, seedDB } = require("../db/fixtures/db");

beforeEach(seedDB);

test("should be able to create a task for this user", async () => {
  const data = {
    task_desc: "read a book",
    completed: false
  };

  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send(data)
    .expect(200);


  const task = await Task.findById(res.body._id);
  expect(task).not.toBeNull()
});

test("should get all tasks for this user", () => {});

test("should be able to update task for this user", () => {});

test("should not be able to update task for other user", () => {});
