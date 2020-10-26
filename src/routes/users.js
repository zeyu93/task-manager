var express = require("express");
var router = express.Router();
const sharp = require("sharp");
const multer = require("multer");

const User = require("../models/Users");
const handleAuth = require("../middleware/auth");

const upload = multer({
  limits: {
    fileSize: 15000000
  },
  fileFilter(req, file, cb) {
    const acceptableFileExtenstions = ["jpg", "png", "jpeg"];
    const [fileName, extension] = file.originalname.split(".");
    if (acceptableFileExtenstions.indexOf(extension) === -1) {
      cb(new Error("must be in jpg, png or jpeg"));
    } else {
      cb(null, true);
    }
  }
});

router.get("/me", handleAuth, async (req, res) => {
  res.send(req.user);
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

router.post(
  "/me/avatar",
  handleAuth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ message: err.message });
  }
);

router.delete("/me/avatar", handleAuth, async (req, res) => {
  req.user.avatar = null;
  await req.user.save();
  res.send();
});

router.post("/", async (req, res, next) => {
  try {
    const newUser = new User(req.body);
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

router.post("/logout", handleAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logout/all", handleAuth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/me", handleAuth, async (req, res) => {
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
    const user = req.user;
    updates.forEach(property => {
      user[property] = req.body[property];
    });
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/me", handleAuth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
