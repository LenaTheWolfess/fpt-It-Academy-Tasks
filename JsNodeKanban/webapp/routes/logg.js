const express = require('express');
const mongoose  = require('mongoose');

const bcrypt = require('bcrypt');

const router = express.Router();

router.use(express.json());

const schemaUser = new mongoose.Schema({
    name: String,
    token: String
 });

const Users = mongoose.model('users');

router.post('/', (req, res) => {
    mongoose.connect('mongodb://localhost/Kanban', {
        useNewUrlParser: true,
        useUnifiedTopology: true
     }).then((db) => {
        Users.findOne({name: req.body.name}).then((user) => {
           db.disconnect();
           if (!user) {
             res.status(404).send({error: "wrong name or password"});
            return;
           }
           if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(404).send({error: "wrong name or password"});
            return;
           }
           res.status(200).send({token: user.token, name: user.name});
      }).catch((msg) => {
          db.disconnect();
          res.status(400).send({error: "wrong data", "msg": msg.errors});
     });
    }).catch((err)=> {
       res.status(400).send({error: "not connected", "msg": err});
    });
});

module.exports = router;