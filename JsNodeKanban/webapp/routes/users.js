
const express = require('express');
const mongoose  = require('mongoose');

const router = express.Router();

const url = "mongodb://localhost:27017/Kanban";

router.use(express.json());

const schemaUser = new mongoose.Schema({
   name: String,
   token: String,
   password: String
});

const Users = mongoose.model('users', schemaUser);

router.get('/', (req, res) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((db) => {
    Users.find({}, {_id: 0}).then((users) => {
      db.disconnect();
      res.send({results: users});
    });
  }).catch((msg) => { res.status(400).send("wrong request")});

});

module.exports = router;