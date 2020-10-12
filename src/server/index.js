const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const User = require("../models/Users");
const Task = require("../models/Tasks");
require("../db/mongoose");

const app = express();
app.use(express.json());

app.get("/tasks", async (req, res) => {
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

app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      if (!task) {
        return res.status(404).send();
      }
      res.status(202).send(task);
    })
    .catch(e => {
      res.status(500).send(e);
    });
});
app.post("/tasks", (req, res, next) => {
  const { task_desc, completed } = req.body;
  const newTask = new Task({
    task_desc,
    completed
  });

  newTask
    .save()
    .then(response => {
      res.send(response);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then(tasks => {
      res.status(202).send(tasks);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get("/users/:id", (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  console.log(id);
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch(e => {
      res.status(500).send(e);
    });
});

app.post("/users", (req, res, next) => {
  const { name, age, email, password } = req.body;
  const newUser = new User({ name, age, password, email });
  newUser
    .save()
    .then(res => res.send(res))
    .catch(e => {
      res.status(500).send(e);
    });
});

app.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});
