require("dotenv").config();
const { Client } = require("pg");
const { argv } = require('node:process');

const SQL = `
DROP TABLE IF EXISTS records, genres, records_genres;
`;

async function main(cstring) {
  console.log("Deleting tables...");
  const client = new Client({
    connectionString: cstring,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main(argv[2]);