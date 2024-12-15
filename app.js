const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("HELLO WORLD");
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})