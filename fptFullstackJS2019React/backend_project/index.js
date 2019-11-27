// imports
const express = require("express");
const commentRouter = require('./routes/comments')
const scoreRouter = require("./routes/scores");
const homeRouter = require("./routes/home");
const carsRouter = require('./routes/cars')

const app = express();

app.use(express.json());

// routes
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use("/api/scores", scoreRouter);
app.use("/api/comments", commentRouter);
app.use("/api/cars", carsRouter);
app.use("/", homeRouter);

// run app
const port = process.env.WEBAPP_PORT || 3300;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
