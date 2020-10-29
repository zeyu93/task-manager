require("../db/mongoose");
const express = require("express");
const handleTaskRoutes = require("../routes/tasks");
const handleUserRoutes = require("../routes/users");

const app = express();

app.use(express.json());
app.use("/tasks", handleTaskRoutes);
app.use("/users", handleUserRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Task App, HEALTH CHECK");
});

module.exports = app;
