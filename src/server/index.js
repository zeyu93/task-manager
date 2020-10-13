const express = require("express");

const PORT = process.env.PORT || 3000;
const handleTaskRoutes = require("../routes/tasks");
const handleUserRoutes = require("../routes/users");

require("../db/mongoose");

const app = express();
app.use(express.json());

app.use("/tasks", handleTaskRoutes);
app.use("/users", handleUserRoutes);

app.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});
