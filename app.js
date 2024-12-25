require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const genreRouter = require("./routes/genreRouter");
const recordRouter = require("./routes/recordRouter")
const path = require("node:path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/genre", genreRouter);
app.use("/record", recordRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})