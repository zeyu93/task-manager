var express = require("express");
var router = express.Router();
const Task = require("../models/Tasks");
const handleAuth = require("../middleware/auth");

router.get("/", handleAuth, async (req, res) => {
  const { completed, page, size, sortBy } = req.query;
  const match = {};
  const sort = {};
  if (completed) {
    match.completed = completed === "true";
  }
  if (sortBy) {
    const [field, order] = sortBy.split("_");
    sort[field] = order === "des" ? -1 : 1;
  }
  console.log(sort)

  skip = parseInt(size) * parseInt(page - 1);

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(size),
          skip,
          sort
        }
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/", handleAuth, async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      owner: req.user.id
    });

    await newTask.save();
    res.send(newTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id", handleAuth, async (req, res) => {
  try {
    console.log(req.user._id, req.params.id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/:id", handleAuth, async (req, res) => {
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
    let task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).send("no task found");
    }
    updates.forEach(property => (task[property] = req.body[property]));
    await updates.save();

    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/:id", handleAuth, async (req, res) => {
  try {
    let task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
