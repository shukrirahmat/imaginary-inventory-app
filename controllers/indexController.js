const db = require("../db/queries");

const getIndexPage = async (req, res) => {
    const genres = await db.getAllGenres();
    res.render("index", {title: "Home Page", genres});
}

module.exports = {
    getIndexPage
}