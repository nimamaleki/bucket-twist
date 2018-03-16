const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const Mongodb = require('mongodb')
var phonegap = require('connect-phonegap')


var db

app.use(phonegap());
app.use(bodyParser.urlencoded({extended: true}))
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

MongoClient.connect('mongodb://treema:enterwithease99percent@ds261128.mlab.com:61128/bucket_twist_master', (err, database) => {   // ... start the server

	if (err) return console.log(err)
	db = database.db('bucket_twist_master');
	ideas_db = db.collection('ideas');

	var port = 55555;
	app.listen(port, function() {
	  console.log('listening on ' + port)
	})


})

//Utility functions

var objectIdFromDate = function (date) {
  return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};

var dateFromObjectId = function (objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

//API

app.post('/newidea', (req, res) => {
  //console.log(req.query)
  var record = req.query
  ideas_db.save(record, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database');
    res.json('saved!')
  })
})


app.get('/ideas', (req, res) => {
  ideas_db.find().toArray(function(err, results) {
  //for (var i = 0; i < results.length; i++){
    //var id = Mongodb.ObjectID(results[i]["_id"]);
    //results[i]["timestamp"] = Date(JSON.stringify(id.getTimestamp()));

    //results[i]["timestamp"] = JSON.stringify(results[i]["_id"]);
  //}
    res.json(results);
  })
})


app.get('/search', (req, res) => {
  ideas_db.find({idea: {$regex : ".*"+req.query.search_parameter+".*",$options: 'i'}}).toArray(function(err, results) {
    console.log(results.length);
    //for (var i = 0; i < results.length; i++){
    //  var id = new require('mongodb').ObjectID(results[i]["_id"]);
    //  results[i]["timestamp"] = Date(JSON.stringify(id.getTimestamp()));
    //}
    res.json(results);
  })
})

app.get('/ideas/user', (req, res) => {
  ideas_db.find({ author: req.query.username }).toArray(function(err, results) {
    //console.log(req.query.username);
    //console.log(results.length);
    //for (var i = 0; i < results.length; i++){
    //  var id = new require('mongodb').ObjectID(results[i]["_id"]);
    //  results[i]["timestamp"] = Date(JSON.stringify(id.getTimestamp()));
    //}
    res.json(results);
  })
})
