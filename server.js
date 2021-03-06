//require.paths.push('./public/js');

var express = require('express');
var app = express();
var mongo = require('mongodb');
//var Places = require('./server/models/places');
//var Place = require('./public/js/models/place.js');



app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use('/', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/test', express.static(__dirname + '/public'));
app.use('/test', express.static(__dirname + '/tests/'));

app.enable('trust proxy');



//database
var server = new mongo.Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new mongo.Db('nitedb', server);

var Places = require('./server/routes/places');
var places = new Places(app, db, delay);

var Coms = require('./server/routes/coms');
var coms = new Coms(app, db, delay);

db.open(function(err, db) {
	if(!err) {
		console.log('connected to nitedb database');
	}
});


app.get('*.webapp', function (req, res, next) {
  res.header('Content-Type', 'application/x-web-app-manifest+json');
  next();
});

//network simulation
function delay(req, res, next) {
	setTimeout(next, Math.random()*500+200);
	//next();
}

app.post('/log', function(req, res) {
	console.log(req.body);
	res.send(200);
});

app.listen(3001);
console.log("listening on port 3000");