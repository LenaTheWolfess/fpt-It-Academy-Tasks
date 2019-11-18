// imports
const express = require('express');
const tasks = require('./routes/tasksMongoose');
const users = require('./routes/users');
const swimlines = require('./routes/swimlinesMongoose');
const auth = require('./routes/auth');
const logg = require('./routes/logg');
const regg = require('./routes/register');

const config = require('config');

const app = express();

const port = config.get("port");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// midleware
app.use(express.static('client'));

app.use('/regg', regg);
app.use('/logg', logg);
app.use(auth);

// routes
app.use('/tasks', tasks);
app.use('/swimlines', swimlines);
app.use('/users', users);

// run
app.listen(port, ()=>{console.log(`listening port ${port}`)});

