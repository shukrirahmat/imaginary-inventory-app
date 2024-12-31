require("dotenv").config();
const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?sslmode=require`
});
