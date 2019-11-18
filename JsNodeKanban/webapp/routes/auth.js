 const MongoClient = require('mongodb').MongoClient;
 const url = "mongodb://localhost:27017";

 async function auth(req, res, next) {
	if (req.method == "OPTIONS") {
	  next();
	  return;
	}
	const token = req.headers['user-token'];
    if (!token) {
	  res.status(401).send({error: "Not authentificated"});
	  return;
	}

	MongoClient.connect(url, (err, db) => {
		const dbo = db.db("Kanban");
		dbo.collection('users').find({token: token}).toArray( (err, data) => {
		  if (err) throw err;
		  db.close();
		  if (!data || !data.length) {
			res.status(401).send({error: "Not authentificated"});
			return;
		  }
		  const user = data[0];
		  req.user = user;
		  next();
		});
	 });
 }

 module.exports = auth;