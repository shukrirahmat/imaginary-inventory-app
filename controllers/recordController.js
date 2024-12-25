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

const getNewRecordPage = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("newRecord", { title: "Add new record", genres });
};

const validateRecord = [
  body("record_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Title cannot be empty`),
  body("artist")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Artist cannot be empty`),
  body("year")
    .isNumeric()
    .withMessage("Year should only contains number")
    .isInt({ min: 1000, max: 9999 })
    .withMessage("Must enter a logical year"),
  body("imgurl").trim(),
];

const createNewRecord = [
  validateRecord,
  async (req, res) => {
    const errArray = validationResult(req).array();
    if (!req.body.genres) {
      errArray.push({ msg: "Must check at least one genre" });
    }
    if (errArray.length > 0) {
      const genres = await db.getAllGenres();
      return res.status(400).render("newRecord", {
        title: "Add new record",
        genres,
        errors: errArray,
      });
    }
    await db.addNewRecord(
      req.body.record_name,
      req.body.artist,
      parseInt(req.body.year),
      req.body.imgurl,
      [].concat(req.body.genres)
    );
    const genreNames = await db.getGenreNamesFromIds(
      [].concat(req.body.genres)
    );
    const genreNamesStr = genreNames
      .map((genre) => {
        return `${genre.genre_name}`;
      })
      .join(", ");
    res.render("recordCreateSuccess", {
      record_name: req.body.record_name,
      artist: req.body.artist,
      year: req.body.year,
      imgurl: req.body.imgurl,
      genres: genreNamesStr,
    });
  },
];

const deleteRecord = async (req, res) => {
  const deleteId = req.body.deleteId;
  await db.deleteRecord(deleteId);
  res.redirect(req.get("Referrer") || "/");
};

const getEditPage = async (req, res) => {
  const defData = req.body;
  let defGenres = await db.getGenreListFromRecord(defData.id);
  defGenres = defGenres.map((genre) => {
    return genre.genre_id;
  });
  const genres = await db.getAllGenres();
  res.render("editRecord", {
    title: "Editing",
    genres,
    defId: defData.id,
    defName: defData.record_name,
    defArtist: defData.artist,
    defYear: defData.year,
    defImgurl: defData.imgurl,
    defGenres,
  });
};

const editRecord = [
  validateRecord,
  async (req, res) => {
    let defGenres = [].concat(req.body.defGenres);
    defGenres = defGenres.map((dg) => {
      return parseInt(dg);
    });
    const errArray = validationResult(req).array();
    if (!req.body.genres) {
      errArray.push({ msg: "Must check at least one genre" });
    }
    if (errArray.length > 0) {
      const genres = await db.getAllGenres();
      return res.status(400).render("editRecord", {
        title: "Editing",
        genres,
        errors: errArray,
        defId: req.body.defId,
        defName: req.body.defName,
        defArtist: req.body.defArtist,
        defYear: req.body.defYear,
        defImgurl: req.body.defImgurl,
        defGenres,
      });
    }
    await db.editRecord(
      req.body.defId,
      req.body.record_name,
      req.body.artist,
      parseInt(req.body.year),
      req.body.imgurl,
      [].concat(req.body.genres)
    );
    const genreNames = await db.getGenreNamesFromIds(
      [].concat(req.body.genres)
    );
    const genreNamesStr = genreNames
      .map((genre) => {
        return `${genre.genre_name}`;
      })
      .join(", ");
    res.render("editSuccess", {
      record_name: req.body.record_name,
      artist: req.body.artist,
      year: req.body.year,
      imgurl: req.body.imgurl,
      genres: genreNamesStr,
    });
  },
];

module.exports = {
  getAllRecords,
  getRecordsInGenre,
  getNewRecordPage,
  createNewRecord,
  deleteRecord,
  getEditPage,
  editRecord,
};
