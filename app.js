require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const genreRouter = require("./routes/genreRouter");

app.use("/", indexRouter);
app.use("/genre", genreRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})