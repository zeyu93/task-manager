const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useCreateIndex: true,
  useNewUrlParser: true
});

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("negative age not possible");
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid email format");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(value) {
      if (value.includes("password")) {
        throw new Error('password cannot contain " passowrd " ');
      }
    }
  }
});

const me = new User({
  name: "zeyukk",
  email: "yo@YSS.com",
  password: "password"
});

me.save()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
