const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const {
  User,
  validateRegistration,
  validateUpdating
} = require("../models/user");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

router.post("/", async (req, res) => {
  const _ = require("lodash");
  const { error } = validateRegistration(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).send({ path, message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const error = { path: "email", message: "email already registered." };
    return res.status(400).send(error);
  }

  user = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "password"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  ///////////////////////////////////////////////////////////////
  // res
  //   .header("x-auth-token", token)
  //   .header("access-control-expose-headers", "x-auth-token")
  //   .send(_.pick(user, ["_id", "name", "email"]));
  //////////////////////////////////////////////////////////////

  res.send(token);
});

router.put("/", [auth, upload.single("profileImage")], async (req, res) => {
  const _ = require("lodash");

  const { error } = validateUpdating(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).send({ path, message });
  }

  if (req.body.userName) {
    const user = await User.findOne({ userName: req.body.userName });

    if (user && user._id != req.user._id) {
      const error = { path: "userName", message: "username already taken." };
      return res.status(400).send(error);
    }
  }

  let user = _.pick(req.body, [
    "firstName",
    "lastName",
    "userName",
    "birthday",
    "gender",
    "relationship",
    "about",
    "email",
    "phoneNumber",
    "city",
    "address"
  ]);

  if (req.file) user.profileImage = req.file.path;

  user = await User.findByIdAndUpdate(req.user._id, user, { new: true });

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send("Your profile has been updated");
});

module.exports = router;
