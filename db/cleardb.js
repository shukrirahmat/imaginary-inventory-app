require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS records, genres, records_genres;
`;

async function main() {
  console.log("Deleting tables...");
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PW}@${process.env.HOST}:5432/${process.env.DB}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();