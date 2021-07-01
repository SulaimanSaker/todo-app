const Joi = require("joi");
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    maxlength: 50
  }
});

const Image = mongoose.model("Image", imageSchema);

function validateImage(image) {
  const schema = {
    path: Joi.string()
      .max(50)
      .required()
  };

  return Joi.validate(image, schema);
}

exports.imageSchema = imageSchema;
exports.Image = Image;
exports.validate = validateImage;
