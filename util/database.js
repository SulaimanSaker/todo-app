const mysql = require("mysql2");
const config = require("config");

const pool = mysql.createPool({
  host: config.get("mysql_host"),
  user: config.get("mysql_user"),
  database: config.get("mysql_database"),
  password: config.get("mysql_password"),
});

module.exports = pool.promise();
