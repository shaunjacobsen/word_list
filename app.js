const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("./config/config");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth"
  );
  res.header("Access-Control-Expose-Headers", "x-auth");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/japanese/:keyword", async (req, res) => {
  try {
    const result = await axios.get(
      `https://jisho.org/api/v1/search/words?keyword=${req.params.keyword}`
    );
    const data = result.data.data;
    const commonWords = data.filter(word => word.is_common === true);
    const ret = commonWords.map(word => {
      return {
        japanese: word.japanese,
        definition: word.senses,
      }
    })
    res.json(ret);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, () => {
    console.log(`Server up on ${process.env.PORT}`);
  });
}

module.exports = { app };
