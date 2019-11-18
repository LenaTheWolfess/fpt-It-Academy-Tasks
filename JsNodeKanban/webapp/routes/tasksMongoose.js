const express = require('express');
const mongoose  = require('mongoose');

const joi = require('joi');
joi.ObjectId = require('joi-objectid')(joi);

const router = express.Router();

const url = "mongodb://localhost:27017/Kanban";

router.use(express.json());

const schemaTask = new mongoose.Schema({
    title: { type: String, required: true, trim: true, min: 1},
    swimline: { type: Number, default: 1},
    tags: {
        type: Array,
        validate: {
          validator: function(value) {
            if (!value || !value.length)
              return false;
            for (const v of value) {
              if (!v.trim().length)
                return false;
            }
            return true;
          },
          message: 'Only non empty tags and at least one'
        }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
})

const Task = mongoose.model('tasks', schemaTask);

router.get('/', (req, res) => {
    const user = req.user;
    const q = req.query;
    const question = {owner: user._id};
    if (q && q.where) {
       const wh = JSON.parse(q.where);
       if (wh.swimline)
         question.swimline = +wh.swimline;
       if (wh.tags)
         question.tags = {$all: wh.tags};
    }
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((db) => {
      console.log(question);
      Task.find(question).then((tasks) => {
        db.disconnect();
        res.send({results: tasks});
      });
    }).catch((msg) => { res.status(400).send("wrong request")});
 })
 router.get('/:id', (req, res) => {
   const user = req.user;
   const id = req.params.id;
   const question = {owner: user._id, _id: id};
   mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }).then((db) => {
   Task.findOne(question).then((task) => {
      db.disconnect();
      if (!task) {
         res.status(404).send({error: `Task does not exist`});
         return;
      }
      res.send(task);
     });
   });
 })
 router.post('/', (req, res) => {
   const user = req.user;

   const task = new Task({
     owner: new mongoose.Types.ObjectId(user._id),
     title: req.body.title,
     swimline: req.body.swimline,
     tags: req.body.tags
   });

  const jSchema = joi.object({
    title: joi.string().trim().min(1).max(100).required(),
    swimline: joi.number().default(1),
    tags: joi.array().required(),
    owner: joi.ObjectId(),
    createdAt: joi.date(),
    updatedAt: joi.date()
  })

 // jSchema.validate(task).then(() => {

   mongoose.connect('mongodb://localhost/Kanban', {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }).then((db) => {
     task.save().then((inserted) => {
        db.disconnect();
        res.status(201).send(JSON.stringify({_id: inserted._id}));
     }).catch((msg) => {
        db.disconnect();
        res.status(400).send({error: "wrong data", "msg": msg.errors});
     });
   });

 // }).catch((err)=> {
  //   res.status(400).send({error: "wrong data joi", "msg": err});
 // });
 })
 router.delete('/:id', (req, res) => {
  const user = req.user;
  const id = req.params.id;
  mongoose.connect('mongodb://localhost/Kanban', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((db) => {
    Task.findOneAndRemove({_id: id, owner: user._id}).then((removed) => {
        db.disconnect();
        if (!removed) {
            res.status(404).send({error: `Task does not exist`});
            return;
        }
        res.status(204).send();
    })
    .catch((msg) => {
       res.status(400).send({error: `bad request`});
    });
  });
 });
 router.put('/:id', (req, res) => {
   const user = req.user;
   const id = req.params.id;

   mongoose.connect('mongodb://localhost/Kanban', {
     useNewUrlParser: true,
     useUnifiedTopology: true
   }).then((db) => {
      const filter = {_id: id, owner: user._id};
      const newData = {
          title: req.body.title,
          swimline: req.body.swimline,
          updatedAt: Date.now()
      };
      Task.findOneAndUpdate(filter, newData)
      .then((modified) => {
           db.disconnect();
           if (!modified) {
             res.status(404).send({error: `Task does not exists`});
             return;
           }
           res.send({_id: modified._id, updatedAt: modified.updatedAt});
      })
      .catch((msg) => {
         db.disconnect();
         res.status(400).send({error: `wrong data`});
      });
   });
 });

 module.exports = router;
