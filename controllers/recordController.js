const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const getAllRecords = asyncHandler(async (req, res) => {
  const result = await db.getAllRecords();
  res.render("records", {
    title: "All Records",
    records: result.rows,
    amount: result.rowCount,
    prevPage: "all",
  });
});

const getRecordsInGenre = asyncHandler(async (req, res) => {
  const genreId = req.params.genreId;

  if (isNaN(genreId)) {
    throw new CustomNotFoundError("Genre not found");
  }

  const result = await db.getRecordsInGenre(genreId);
  const genreNameRes = await db.getGenreName(genreId);

  if (result.length < 1 || genreNameRes.length < 1) {
    throw new CustomNotFoundError("Genre not found");
  }

  const genreName = genreNameRes[0].genre_name;
  res.render("records", {
    title: ` ${genreName} Records`,
    records: result.rows,
    amount: result.rowCount,
    prevPage: `${genreId}`,
  });
});

const getNewRecordPage = asyncHandler(async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("newRecord", { title: "Add new record", genres });
});

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
  asyncHandler(async (req, res) => {
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
    const params = new URLSearchParams({
      record_name: req.body.record_name,
      artist: req.body.artist,
      year: req.body.year,
      imgurl: req.body.imgurl,
      genres: genreNamesStr,
    });
    res.redirect(`/record/createSuccess/?${params.toString()}`);
  }),
];

const showCreateSuccessPage = asyncHandler(async (req, res) => {
  const { record_name, artist, year, imgurl, genres } = req.query;
  res.render("recordCreateSuccess", {
    message: "Successfully added",
    record_name,
    artist,
    year,
    imgurl,
    genres,
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {prevPage} = req.body;
  await db.deleteRecord(id);
  res.redirect(`/record/${prevPage}`);
});

const getEditPage = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const recordQuery = await db.getRecordFromId(id);
  const record = recordQuery[0];

  let defGenres = await db.getGenreListFromRecord(id);
  defGenres = defGenres.map((genre) => {
    return genre.genre_id;
  });
  const genres = await db.getAllGenres();
  res.render("editRecord", {
    title: "Editing",
    genres,
    defId: record.id,
    defName: record.record_name,
    defArtist: record.artist,
    defYear: record.year,
    defImgurl: record.imgurl,
    defGenres,
  });
});

const editRecord = [
  validateRecord,
  asyncHandler(async (req, res) => {
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
    const params = new URLSearchParams({
      record_name: req.body.record_name,
      artist: req.body.artist,
      year: req.body.year,
      imgurl: req.body.imgurl,
      genres: genreNamesStr,
    })
    res.redirect(`/record/editSuccess/?${params.toString()}`);
  }),
];

const showEditSuccessPage = asyncHandler(async (req, res) => {
  const { record_name, artist, year, imgurl, genres } = req.query;
  res.render("recordCreateSuccess", {
    message: "Edit success",
    record_name,
    artist,
    year,
    imgurl,
    genres,
  });
})

const viewRecord = asyncHandler(async (req, res) => {
  const { id, record_name, artist, year, imgurl, genre_str, prevPage} = req.query;
  res.render("viewRecord", {
    id,
    record_name,
    artist,
    year,
    imgurl,
    genres: genre_str,
    prevPage
  });
});

module.exports = {
  getAllRecords,
  getRecordsInGenre,
  getNewRecordPage,
  createNewRecord,
  deleteRecord,
  getEditPage,
  editRecord,
  viewRecord,
  showCreateSuccessPage,
  showEditSuccessPage,
};
