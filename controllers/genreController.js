const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

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

const getSettingsPage = async (req, res) => {
  res.render("genreSettings", {title: "Genre Settings"});
}

/////////

const validateUser = [
  body("newgenre")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(
      `Genre name is too long!\nIt should be less than 20 characters`
    ),
];

const createNewGenre = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    const genres = await db.getAllGenres();
    if (!errors.isEmpty()) {
      return res.status(400).render("genreSettings", {
        title: "Genre Settings",
        genres,
        errors: errors.array(),
      });
    }

    const toAdd = req.body.newgenre;
    const genreExist = await db.checkIfGenreExists(toAdd);
    if (genreExist[0].exists) {
      return res.status(400).render("genreSettings", {
        title: "Genre Settings",
        genres,
        errors: [{msg:"That genre already exists"}]
      });
    }
    await db.addNewGenre(toAdd);
    res.render("genreAddSuccess", {justadded: `${toAdd}`})
  },
];

module.exports = {
  getAllRecords,
  getRecordsInGenre,
  getSettingsPage,
  createNewGenre
};
