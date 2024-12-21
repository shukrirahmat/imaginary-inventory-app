const db = require("../db/queries");

const getAllRecords = async (req, res) => {
  const result = await db.getAllRecords();
  res.render("records", {
    title: "All Records",
    records: result.rows,
    amount: result.rowCount,
  });
};

const getRecordsInGenre = async (req, res) => {
  const genreId = req.params.genreId;
  const result = await db.getRecordsInGenre(genreId);
  const genreNameRes = await db.getGenreName(genreId);
  const genreName = genreNameRes[0].genre_name;
  res.render("records", {
    title: ` ${genreName} Records`,
    records: result.rows,
    amount: result.rowCount,
  });
};

module.exports = {
  getAllRecords,
  getRecordsInGenre,
};
