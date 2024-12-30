const pool = require("./pool");

async function getAllRecords() {
  const query = `
    SELECT records.id, records.record_name, records.artist, records.year, records.imgurl, string_agg(genres.genre_name, ', ' ORDER BY genre_name) AS genre_str
    FROM records
    INNER JOIN records_genres
    ON records.id = record_id
    INNER JOIN genres
    ON genres.id = genre_id
    GROUP BY records.id, records.record_name, records.artist, records.year, records.imgurl
    ORDER BY records.artist;
    `;
  const { rows, rowCount } = await pool.query(query);
  return { rows, rowCount };
}

async function getRecordsInGenre(genreId) {
  const query = `
    SELECT newtable.*, records_genres.genre_id FROM
    (SELECT records.id, records.record_name, records.artist, records.year, records.imgurl, string_agg(genres.genre_name, ', ' ORDER BY genre_name) AS genre_str
    FROM records
    INNER JOIN records_genres
    ON records.id = record_id
    INNER JOIN genres
    ON genres.id = genre_id
    GROUP BY records.id, records.record_name, records.artist, records.year, records.imgurl
    ORDER BY records.id) AS newtable
    INNER JOIN records_genres
    ON record_id = newtable.id
    INNER JOIN genres
    ON genre_id = genres.id
    WHERE genre_id = ${genreId}
    ORDER BY newtable.artist;
    `;
  const { rows, rowCount } = await pool.query(query);
  return { rows, rowCount };
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY genre_name");
  return rows;
}

async function getGenreListFromRecord(recordId) {
  const query = `
  SELECT genre_id FROM records_genres
  WHERE record_id = ${recordId}
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getGenreName(genreId) {
  const query = `
        SELECT genre_name FROM genres
        WHERE id = ${genreId};
    `;
  const { rows } = await pool.query(query);
  return rows;
}

async function checkIfGenreExists(name) {
  const query = `
        SELECT EXISTS (
            SELECT genre_name FROM genres
            WHERE LOWER(genre_name) = LOWER('${name}')
        )
    `;
  const { rows } = await pool.query(query);
  return rows;
}

async function checkIfGenreExistExcludingID(name, id) {
  const query = `
        SELECT EXISTS (
            SELECT genre_name FROM genres
            WHERE id = ${id} AND LOWER(genre_name) = LOWER('${name}')
        )
    `;
  const { rows } = await pool.query(query);
  return rows;
}

async function addNewGenre(name) {
  const query = `
    INSERT INTO genres (genre_name)
    VALUES
    ('${name}')
    `;
  await pool.query(query);
}

async function addNewRecord(record_name, artist, year, imgurl, genreIds) {
  const insertQuery = `
  INSERT INTO records (record_name, artist, year, imgurl)
  VALUES
  ('${record_name}', '${artist}', ${year}, '${imgurl}');
  `;
  await pool.query(insertQuery);
  const idquery = await pool.query(`SELECT lastval()`);
  const recordId = idquery.rows[0].lastval;
  const genreQueryString = genreIds
    .map((genreId) => {
      return `(${recordId},${genreId})`;
    })
    .join(",");
  const genreInsertQuery = `
  INSERT INTO records_genres (record_id, genre_id)
  VALUES
  ${genreQueryString};
  `;
  await pool.query(genreInsertQuery);
}

async function getGenreNamesFromIds(genreIds) {
  const idString = genreIds
    .map((genreId) => {
      return `${genreId}`;
    })
    .join(",");
  const query = `
  SELECT genre_name from genres
  WHERE id IN (${idString})
  ORDER BY genre_name;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function checkIfThereIsRecordWithGenre(id) {
  const query = `
  SELECT * FROM records_genres
  WHERE genre_id = ${id};
  `;
  const { rowCount } = await pool.query(query);
  return rowCount;
}

async function deleteGenre(id) {
  const query = `
  DELETE FROM genres
  WHERE id = ${id};
  `;
  await pool.query(query);
}

async function renameGenre(name, id) {
  const query = `
  UPDATE genres
  SET genre_name = '${name}'
  WHERE id = ${id};
  `;
  await pool.query(query);
}

async function deleteRecord(deleteId) {
  const recordTable = `
  DELETE FROM records
  WHERE id = ${deleteId};
  `;
  const relationsTable = `
  DELETE FROM records_genres
  WHERE record_id = ${deleteId};
  `;
  await pool.query(recordTable);
  await pool.query(relationsTable);
}

async function editRecord(id, record_name, artist, year, imgurl, genreIds) {
  const updateRecords = 
  `
  UPDATE records
  SET record_name = '${record_name}',
  artist = '${artist}',
  year = ${year},
  imgurl = '${imgurl}'
  WHERE id = ${id}
  `;
  const deleteRelations = 
  `
  DELETE FROM records_genres
  WHERE record_id = ${id};
  `;
  const relationString = genreIds
    .map((genreId) => {
      return `(${id},${genreId})`;
    })
    .join(",");
  const updateRelations = `
  INSERT INTO records_genres (record_id, genre_id)
  VALUES
  ${relationString};
  `;
  await pool.query(updateRecords);
  await pool.query(deleteRelations);
  await pool.query(updateRelations);

}

module.exports = {
  getAllRecords,
  getAllGenres,
  getRecordsInGenre,
  getGenreListFromRecord,
  getGenreName,
  checkIfGenreExists,
  checkIfGenreExistExcludingID,
  addNewGenre,
  addNewRecord,
  getGenreNamesFromIds,
  checkIfThereIsRecordWithGenre,
  deleteGenre,
  renameGenre,
  deleteRecord,
  editRecord,
};
