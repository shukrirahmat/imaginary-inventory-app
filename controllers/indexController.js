const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const getIndexPage = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("index", { title: "Home Page", genres });
};

////////////////////////////////////

const validateUser = [
  body("newgenre")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(
      `Genre name is too long!\nIt should be less than 20 characters`
    ),
];

const addNewGenre = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    const genres = await db.getAllGenres();
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        title: "Home Page",
        genres,
        errors: errors.array(),
      });
    }

    const toAdd = req.body.newgenre;
    const genreExist = await db.checkIfGenreExists(toAdd);
    if (genreExist[0].exists) {
      return res.status(400).render("index", {
        title: "Home Page",
        genres,
        errors: [{msg:"That genre already exists"}]
      });
    }
    await db.addNewGenre(toAdd);
    res.redirect("/")
  },
];

module.exports = {
  getIndexPage,
  addNewGenre,
};
