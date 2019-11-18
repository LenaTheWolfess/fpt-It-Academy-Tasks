const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();

var url = 'mongodb://localhost/Kanban';

const schemaSwimline = new mongoose.Schema({
    number: { type: Number, required: true, min: 1},
    caption: {type: String, required: true, trim: true, min: 1},
    category: {type: String, required: true, trim: true, min: 1}
})

const Swimline = mongoose.model('swimlines', schemaSwimline);

router.get('/', (req, res) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((db) => {
        Swimline.find().then((swimlines) => {
            db.disconnect();
            res.send({results: swimlines});
        }
    );
 });
});

 module.exports = router;