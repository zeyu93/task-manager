const express = require("express");
const handleTaskRoutes = require("../routes/tasks");
const handleUserRoutes = require("../routes/users");
require("dotenv").config();
require("../db/mongoose");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/tasks", handleTaskRoutes);
app.use("/users", handleUserRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Task App, HEALTH CHECK");
});
app.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});
