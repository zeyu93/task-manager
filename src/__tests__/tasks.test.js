const request = require("supertest");
const app = require("../server/app");
const Task = require("../models/Tasks");
const {
  testUser,
  testUserId,
  seedDB,
  testUserTwo,
  testUserTwoId,
  taskOne
} = require("../db/fixtures/db");

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
  expect(task).not.toBeNull();
});

test("should get all tasks for this user", async () => {
  const resOne = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .expect(200);
  expect(resOne.body.length).toBe(1);

  const resTwo = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${testUserTwo.tokens[0].token}`)
    .expect(200);
  expect(resTwo.body.length).toBe(2);
});

test("should not be able to delete task for other user", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .expect(404);

  let task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("should be able to update task for this user", () => {});
