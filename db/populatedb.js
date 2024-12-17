require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_name VARCHAR ( 255 ),
    artist VARCHAR ( 255 ),
    year SMALLINT
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre_name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS records_genres (
    record_id INTEGER,
    genre_id INTEGER
);
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PW}@${process.env.HOST}:${process.env.PORT}/${process.env.DB}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
