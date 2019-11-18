const express = require('express');
const mongoose  = require('mongoose');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const router = express.Router();

router.use(express.json());

const schemaUser = new mongoose.Schema({
    name: String,
    password: String,
    token: String
 });

const Users = mongoose.model('users');

router.post('/', (req, res) => {
    mongoose.connect('mongodb://localhost/Kanban', {
        useNewUrlParser: true,
        useUnifiedTopology: true
     }).then((db) => {
        Users.findOne({name: req.body.name}).then((user) => {
           if (!user) {
             // Allow register
            let hash = bcrypt.hashSync(req.body.password, 10);
            let newUser = new Users({
               name: req.body.name,
               password: hash,
               token: jwt.sign({name: req.body.name}, 'SOME_TEXT')
            });
            newUser.save().then((saved) => {
                db.disconnect();
                res.status(201).send({token: saved.token, name: saved.name});
            });
            return;
           }
          res.status(400).send({error: "user already exists"});
        }).catch((msg) => {
          db.disconnect();
          console.log(msg)
          res.status(400).send({error: "wrong data", "msg": msg.errors});
     });
    }).catch((err)=> {
       res.status(400).send({error: "cannot connect", "msg": err});
    });
});

module.exports = router;