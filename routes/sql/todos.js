const Todo = require("../../models/sql/todo");
const { validate } = require("../../models/todo");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await Todo.fetchAll();
  res.send(rows);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const todo = new Todo(req.body.text, req.body.completed);

  await todo.save();

  res.send(todo);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const todo = new Todo(req.body.text, req.body.completed);

  await todo.update(req.params.id);

  res.send(todo);
});

router.delete("/:id", async (req, res) => {
  const todo = await Todo.deleteById(req.params.id);

  if (!todo) return res.status(404).send("The todo with the given ID was not found.");

  res.send(todo);
});

router.get("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) return res.status(404).send("The todo with the given ID was not found.");

  res.send(todo);
});

module.exports = router;
