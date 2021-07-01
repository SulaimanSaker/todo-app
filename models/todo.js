const Joi = require('joi');
const mongoose = require('mongoose');

const Todo = mongoose.model(
  'Todos',
  new mongoose.Schema({
    text: {
      type: String,
      required: [true, 'You should enter some text'],
      minlength: [5, 'Text should be at least 5 characters'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  })
);

function validateTodo(todo) {
  const schema = {
    text: Joi.string().min(5).max(50).required(),
    completed: Joi.bool(),
    user: Joi.objectId().required(),
  };

  return Joi.validate(todo, schema);
}

exports.Todo = Todo;
exports.validate = validateTodo;
