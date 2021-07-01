const express = require("express");
const user = require("../routes/users");
const image = require("../routes/images");
const auth = require("../routes/auth");
const todo = require("../routes/todos");
const mysqlTodo = require("../routes/sql/todos");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", user);
  app.use("/api/images", image);
  app.use("/api/auth", auth);
  app.use("/api/todo", todo);
  app.use("/api/sqlTodo/", mysqlTodo);
  app.use(error);
};
