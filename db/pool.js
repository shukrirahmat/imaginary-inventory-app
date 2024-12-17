require("dotenv").config();
const { Pool } = require("pg");

module.exports = new Pool({
  host: process.env.HOST, // or wherever the db is hosted
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PW,
  port: process.env.PORT
});
