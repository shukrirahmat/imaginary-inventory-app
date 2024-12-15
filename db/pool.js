require("dotenv").config();
const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost", // or wherever the db is hosted
  user: "shukri",
  database: "records_store",
  password: "5409",
  port: process.env.PORT
});
