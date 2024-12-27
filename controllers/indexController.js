const db = require("../db/queries");
const asyncHandler = require("express-async-handler");

const getIndexPage = asyncHandler(async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("index", { title: "Home Page", genres });
});

module.exports = {
  getIndexPage,
};
