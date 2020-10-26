const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/Tasks");

const userSchema = new mongoose.Schema(
  {
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
      },
      unique: true
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
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

//methods are instance methods

//hides password and token senstive information before sending response back
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_TOKEN_SECRET
  );

  user.tokens = [...user.tokens, { token }];
  await user.save();

  return token;
};

//statics are model methods
userSchema.statics.findByCredientials = async (email, password) => {
  let user = await User.findOne({ email });
  if (!user) {
    throw new Error("cannot login");
  }

  let isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    throw new Error("wrong login");
  }

  return user;
};

userSchema.pre("save", async function(next) {
  // this reference the user instance
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  next();
});

userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({
    owner: user._id
  });

  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
