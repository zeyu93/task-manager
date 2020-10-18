var express = require("express");
var router = express.Router();
const Task = require("../models/Tasks");

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const { task_desc, completed } = req.body;
    const newTask = new Task({
      task_desc,
      completed
    });

    await newTask.save();
    res.send(newTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/:id", async (req, res) => {
  let allowedUpdatesArr = ["task_desc", "completed"];
  let allowedUpdates = new Set(allowedUpdatesArr);
  let updates = Object.keys(req.body);

  let notValidUpdates = updates.some(item => {
    return !allowedUpdates.has(item);
  });

  if (notValidUpdates) {
    return res.status(404).send("Not valid user property");
  }

  try {
    let task = await Task.findById(req.params.id);
    updates.forEach(property => (task[property] = req.body[property]));
    await updates.save();
    if (!task) {
      res.status(404).send("no task found");
    }

    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
