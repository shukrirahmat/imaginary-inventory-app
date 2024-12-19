require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_name VARCHAR ( 255 ),
    artist VARCHAR ( 255 ),
    year SMALLINT,
    imgurl VARCHAR (255)
);

INSERT INTO records (record_name, artist, year, imgurl)
VALUES
('In Chromes', 'Audiofeet', 2007, '/assets/cover_1.jpeg'),
('Felines of Passion', 'Beth Kush', 1985, '/assets/cover_2.jpeg'),
('Sweaty Palms', 'The Tumbling Rocks', 1971, '/assets/cover_3.jpeg'),
('Crystal Glares', 'Nimbeats', 2010, '/assets/cover_4.jpeg'),
('The Era of Ong', 'Stefan Sullivans', 2010, '/assets/cover_5.jpeg'),
('lifesenselessness', 'Have an Ugly Death', 2008, '/assets/cover_6.jpeg'),
('Turning O', 'Sandal Pumps', 1996, '/assets/cover_7.jpeg'),
('Save it Like it''s Private', 'Made to Spoil', 1999, '/assets/cover_8.jpeg'),
('Theatrical', 'Ladyz', 2017, '/assets/cover_9.jpeg');

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre_name VARCHAR ( 255 )
);

INSERT INTO genres (genre_name)
VALUES
('Rock'),
('Pop'),
('Metal'),
('Shoegaze'),
('Eletronica');

CREATE TABLE IF NOT EXISTS records_genres (
    record_id INTEGER,
    genre_id INTEGER
);

INSERT INTO records_genres (record_id, genre_id)
VALUES
(1,1),
(2,2),
(3,1),
(4,3),
(5,2),
(5,5),
(6,1),
(6,4),
(7,5),
(8,1),
(9,2);

`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PW}@${process.env.HOST}:5432/${process.env.DB}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
