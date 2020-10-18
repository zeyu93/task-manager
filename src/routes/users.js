var express = require("express");

var router = express.Router();
const User = require("../models/Users");
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).send();
    }
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, age, email, password } = req.body;
    const newUser = new User({ name, age, password, email });
    let token = await newUser.generateAuthToken();

    res.status(201).send({ newUser, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredientials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/:id", async (req, res) => {
  let allowedUpdatesArr = ["name", "email", "password", "age"];
  let allowedUpdates = new Set(allowedUpdatesArr);
  let updates = Object.keys(req.body);

  let notValidUpdates = updates.some(item => {
    return !allowedUpdates.has(item);
  });

  if (notValidUpdates) {
    return res.status(404).send("Not valid user property");
  }

  try {
    const user = await User.findById(req.params.id);
    updates.forEach(property => {
      user[property] = req.body[property];
    });
    await user.save();
    if (!user) {
      res.status(404).send("no user found");
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
