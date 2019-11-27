const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const url = "mongodb://localhost:27017/msw";

router.use(express.json());

const carsComment = new mongoose.Schema({
  brand: { type: String, required: true, trim: true, minlength: 1 },
  spz: { type: String, required: true, trim: true, minlength: 7, maxlength: 7 }
});

const Car = mongoose.model("car", carsComment);

router.delete("/:id", (req, res) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(db => {
       Car.findOneAndRemove({_id: req.params.id})
       .then((deleted) => {
          db.disconnect();
          if (!deleted) {
            res.status(404).send({error: "Not found"});
            return;
          }
          res.status(204).send();
       })
       .catch((msg) => {
         res.status(400).send({error: "bad request"});
       })
    })
    .catch(() => {
      res.status(400).send({error: "cannot connect to db"});
    });
});

router.put("/:id", (req, res) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology :true
  })
  .then((db) => {
    const newData = {
      brand: req.body.brand,
      spz: req.body.spz
    };
    Car.findOneAndUpdate({_id: req.params.id}, newData)
    .then((modified) => {
      db.disconnect();
      if (!modified) {
        res.status(404).send({error: "Car does not esits"});
        return;
      }
      res.send({_id: modified._id})
    })
    .catch((msg) => {
      db.disconnect();
      res.status(400).send({error: "wrong data"});
    })
  })
  .catch((msg) => {
    res.status(400).send({error: "could not connect to db"});
  })
})

router.get("/:id", (req, res) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(db => {
    Car.findOne({_id: req.params.id})
    .then((car) => {
      db.disconnect();
      if (!car) {
        res.status(404).send({error: "Car does not exist"});
        return;
      }
      res.send(car);
    })
    .catch((msg) => {
      res.status(400).send({error: "soemthing went wrong"})
    })
  })
  .catch((msg) => {
    res.status(400).send({error: "cannot connect to db"});
  })
})

router.get("/", (req, res) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(db => {
      Car.find({}).then(cars => {
        db.disconnect();
        res.send(cars);
      });
    })
    .catch(() => {
      res.status(400).send({error: "cannot connect to db"});
    });
});

router.post("/", (req, res) => {
  const car = new Car(req.body);
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(db => {
      car
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
