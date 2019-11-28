const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const url = "mongodb://localhost:27017/msw";

router.use(express.json());

const ratingSchema = new mongoose.Schema({
  rating: {type: Number, required: true, min: 1, max: 5}
});

const Rating = mongoose.model("rating", ratingSchema);

router.get("/", (req, res) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(db => {
      Rating.find({}).then(rating => {
        db.disconnect();
        res.send(rating);
      });
    })
    .catch(() => {
      res.status(400).send({error: "cannot connect to db"});
    });
});

router.post("/", (req, res) => {
  const rating = new Rating(req.body);
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(db => {
      rating
        .save()
        .then(inserted => {
          db.disconnect();
          res.status(201).send(JSON.stringify({ _id: inserted._id }));
        })
        .catch(msg => {
          db.disconnect();
          res.status(400).send({ error: "wrong data", msg: msg.errors });
        });
    })
    .catch(() => {
      res.status(400).send({error: "cannot connect to db"});
    });
});

module.exports = router;
