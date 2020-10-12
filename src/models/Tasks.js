const mongoose = require("mongoose");

const Tasks = mongoose.model("Task", {
  task_desc: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = Tasks;
