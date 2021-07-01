const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 25,
  },
  lastName: {
    type: String,
    maxlength: 25,
  },
  userName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
  phoneNumber: {
    type: String,
    maxlength: 25,
  },
  gender: {
    type: String,
    enum: ['', 'Male', 'Female'],
  },
  relationship: {
    type: String,
    enum: ['', 'Single', 'Married'],
  },
  birthday: {
    type: Date,
  },
  city: {
    type: String,
    maxlength: 20,
  },
  address: {
    type: String,
    maxlength: 100,
  },
  about: {
    type: String,
    maxlength: 1024,
  },
  profileImage: {
    type: String,
    maxlength: 100,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      isAdmin: this.isAdmin,
    },
    /*config.get("jwtPrivateKey")*/ 'mySecureJwt'
  );
};

const User = mongoose.model('User', userSchema);

function validateRegistration(user) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().required(),
  };

  return Joi.validate(user, schema);
}

function validateUpdating(user) {
  const schema = {
    userName: Joi.string()
      .regex(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
      .allow(''),
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    birthday: Joi.date().allow(''),
    gender: Joi.string().allow(''),
    relationship: Joi.string().allow(''),
    city: Joi.string().allow(''),
    address: Joi.string().allow(''),
    about: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
    phoneNumber: Joi.string().allow(''),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validateRegistration = validateRegistration;
exports.validateUpdating = validateUpdating;
