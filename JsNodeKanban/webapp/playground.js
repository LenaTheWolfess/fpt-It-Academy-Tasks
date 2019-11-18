const mongoose  = require('mongoose');

const schemaTask = new mongoose.Schema({
    title: { type: String, required: true, trim: true, min: 1},
    swimline: { type: Number, default: 1},
    tags: [{type: String, trim: true, min: 1}],
    owner: { type: mongoose.Schema.Types.ObjectId, required: true},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
})

const Task = mongoose.model('tasks', schemaTask);

const task = new Task({
  title: 'chod domov',
  tags: ['postel', 'lol'],
  swimline: 1,
  owner: new mongoose.Types.ObjectId("5dc2c819e994873758cbf2f9")
});

mongoose.connect('mongodb://localhost/Kanban', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((value) => {
  console.log("pripojilo ma na mongo");
  /*
  task.save()
  .then((value) => console.log('Task saved'))
  .catch((err) => console.log(err));
  */
  Task.find().then((tasks) => {
    console.log(tasks);
  });
})
.catch((err) => {
  console.error("Ta sa nepodarilo");
  console.log(err);
});