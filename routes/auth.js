const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    const { path, message } = error.details[0];
    return res.status(400).send({ path, message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = { path: 'password', message: 'Invalid email or password.' };
    return res.status(400).send(error);
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    const error = { path: 'password', message: 'Invalid email or password.' };
    return res.status(400).send(error);
  }

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
