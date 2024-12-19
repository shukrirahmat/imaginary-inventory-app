const db = require("../db/queries");

const getIndexPage = async (req, res) => {
    const genres = await db.getAllGenres();
    res.render("index", {title: "Home Page", genres});
}

const getAllRecords = async (req, res) => {
    const records = await db.getAllRecords();
    res.render("records", {title: "All Records", records})
}

const getRecordsInGenre = async (req, res) => {
    const genreId = req.params.genreId;
    const records = await db.getRecordsInGenre(genreId);
    const genreName = records[0].genre_name;
    res.render("records", {title: `${genreName} Records`, records})
}

module.exports = {
    getIndexPage,
    getAllRecords,
    getRecordsInGenre
}