const db = require("../../util/database");

module.exports = class Todo {
  constructor(text, completed) {
    this.text = text;
    this.completed = completed;
  }

  save() {
    return db.execute("INSERT INTO todos (text, completed) VALUES (?, ?)", [
      this.text,
      this.completed,
    ]);
  }

  update(id) {
    return db.execute("UPDATE todos SET text = ?, completed= ? WHERE id = ?;", [
      this.text,
      this.completed,
      id,
    ]);
  }

  static deleteById(id) {
    return db.execute("DELETE FROM todos WHERE todos.id = ?;", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM todos");
  }

  static findById(id) {
    return db.execute("SELECT * FROM todos WHERE todos.id = ?", [id]);
  }
};
