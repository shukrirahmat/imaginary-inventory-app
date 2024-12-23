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
  const genres = await db.getAllGenres();
  res.render("genreSettings", { title: "Genre Settings", genres });
};

const validateGenreName = [
  body("newgenre")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(`Genre name cannot be empty or more than 20 characters`),
];

const createNewGenre = [
  validateGenreName,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorText = errors
        .array()
        .map((error) => {
          console.log(error.msg);
          return `${error.msg}`;
        })
        .join("\n");
      const genres = await db.getAllGenres();
      return res.status(400).render("genreSettings", {
        title: "Genre Settings",
        genres,
        addStatus: errorText,
      });
    }
    const toAdd = req.body.newgenre;
    const genreExist = await db.checkIfGenreExists(toAdd);
    if (genreExist[0].exists) {
      const genres = await db.getAllGenres();
      return res.status(400).render("genreSettings", {
        title: "Genre Settings",
        genres,
        addStatus: "That genre already exists",
      });
    }
    await db.addNewGenre(toAdd);
    const genres = await db.getAllGenres();
    res.render("genreSettings", {
      title: "Genre Settings",
      genres,
      addStatus: `Successfully added genre "${toAdd}"`,
    });
  },
];

const deleteGenre = async (req, res) => {
  const id = req.body.genreId;
  const tiedRecords = await db.checkIfThereIsRecordWithGenre(id);
  if (tiedRecords > 0) {
    const genres = await db.getAllGenres();
    return res.status(400).render("genreSettings", {
      title: "Genre Settings",
      genres,
      deleteStatus: `Cannot delete "${req.body.genreName}". There exists ${tiedRecords} records with this genre. \nDelete or edit the records first to make sure the genre is empty`,
    });
  }
  await db.deleteGenre(id);
  const genres = await db.getAllGenres();
  res.render("genreSettings", {
    title: "Genre Settings",
    genres,
    deleteStatus: `Successfully deleted "${req.body.genreName}".`,
  });
};

module.exports = {
  getAllRecords,
  getRecordsInGenre,
  getSettingsPage,
  createNewGenre,
  deleteGenre,
};
