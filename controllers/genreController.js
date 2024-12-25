const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

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
      rdStatus: `Cannot delete "${req.body.genreName}". There exists ${tiedRecords} records with this genre. \nDelete or edit the records first to make sure the genre is empty`,
    });
  }
  await db.deleteGenre(id);
  const genres = await db.getAllGenres();
  res.render("genreSettings", {
    title: "Genre Settings",
    genres,
    rdStatus: `Successfully deleted "${req.body.genreName}".`,
  });
};

const renameGenre = [
  validateGenreName,
  async (req, res) => {
    const msgList = [];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((err) => {
        msgList.push(err.msg);
      })
    }
    const id = req.body.genreId;
    const oldName = req.body.oldgenre;
    const newName = req.body.newgenre;
    if (oldName == newName) {
      msgList.push("You entered the same name. Nothing changed")
    }
    const nameExist = await db.checkIfGenreExistExcludingID(newName, id);
    if (nameExist[0].exist) {
      msgList.push("That genre name already exists");
    }
    if (msgList.length > 0) {
      const genres = await db.getAllGenres();
      const msgstr = msgList.map((msg) => {
        return `${msg}`;
      })
      .join("\n");     
      return res.status(400).render("genreSettings", {
        title: "Genre Settings",
        genres,
        rdStatus: msgstr
      });
    }
    await db.renameGenre(newName, id);
    const genres = await db.getAllGenres();
    res.render("genreSettings", {
      title: "Genre Settings",
      genres,
      rdStatus: `Renamed ${oldName} to ${newName}`,
    });
  },
];

module.exports = {
  getSettingsPage,
  createNewGenre,
  deleteGenre,
  renameGenre
};
