const pool = require("./pool");

async function getAllRecords() {
    const query = 
    `
    SELECT records.id, records.record_name, records.artist, records.year, records.imgurl, string_agg(genres.genre_name, ', ') AS genre_str
    FROM records
    INNER JOIN records_genres
    ON records.id = record_id
    INNER JOIN genres
    ON genres.id = genre_id
    GROUP BY records.id, records.record_name, records.artist, records.year, records.imgurl
    ORDER BY records.id;
    `
    const {rows} = await pool.query(query);
    return rows;
}

async function getRecordsInGenre(genreId) {
    const query = 
    `
    SELECT newtable.*, records_genres.genre_id, genres.genre_name FROM
    (SELECT records.id, records.record_name, records.artist, records.year, records.imgurl, string_agg(genres.genre_name, ', ') AS genre_str
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
    WHERE genre_id = ${genreId};
    `;
    const {rows} = await pool.query(query);
    console.log(rows)
    return rows;
}

async function getAllGenres() {
    const {rows} = await pool.query("SELECT * FROM genres");
    return rows;
}

module.exports = {
    getAllRecords,
    getAllGenres,
    getRecordsInGenre
}