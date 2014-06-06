// server.js

// Base Setup

// Call required packages
var mysql = require('mysql');
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

// Configure app to use bodyParser()
// Allows us to get the data from a POST
app.use(bodyParser());

// Set port
var port = process.env.PORT || 8080;

// Routes for API
router.get('/', function(req, res) {
	res.json({ message: "HELLO FROM THE API!" });
});

/***USERS*********************************************************************/

router.get('/users', function( req, res ) {
	var queryString = 'SELECT * FROM user WHERE accessToken="' + req.query.access_token + '"';

	var connection = mysql.createConnection({
		host: 'askitdb.cvumcgqvkpk0.us-west-2.rds.amazonaws.com',
		user: 'nicholasteo',
		password: 'nicholasteo',
		database: 'askitdb',
		port: 3306
	});

	connection.connect();
	connection.query( queryString, function( err, rows ) {
		var response = { result: "", data: {} };

		if( err ) {
			response.result = "failure";
			response.error = "Query returned error.";
			res.send(response);
		}
		else {
			response.result = "success";
			response.data = rows;
			res.send(response);
		}
	});
	connection.end();
})

/***QUESTIONS*****************************************************************/

router.get('/questions', function(req, res) {
	var connection = mysql.createConnection({
		host: 'askitdb.cvumcgqvkpk0.us-west-2.rds.amazonaws.com',
		user: 'nicholasteo',
		password: 'nicholasteo',
		database: 'askitdb',
		port: 3306
	});

	connection.connect();
	connection.query( 'SELECT * FROM question WHERE author=2', function( err, rows ) {
		var response = { result: "", data: {} };

		if( err ) {
			response.result = "failure";
			response.error = "Query returned error.";
			res.send(response);
		}
		else {
			response.result = "success";
			response.data.questions = rows;
			response.data.count = rows.length;
			res.send(response);
		}
	});
	connection.end();
});

/***ANSWERS*******************************************************************/

router.get('/answers', function( req, res ) {
	var connection = mysql.createConnection({
		host: 'askitdb.cvumcgqvkpk0.us-west-2.rds.amazonaws.com',
		user: 'nicholasteo',
		password: 'nicholasteo',
		database: 'askitdb',
		port: 3306
	});

	connection.connect();
	connection.query( 'SELECT * FROM answer WHERE author=2', function( err, rows ) {
		var response = { result: "", data: {} };

		if( err ) {
			response.result = "failure";
			response.error = "Query returned error.";
			res.send(response);
		}
		else {
			response.result = "success";
			response.data.answers = rows;
			response.data.count = rows.length;
			res.send(response);
		}
	});
	connection.end();
});

/******************************************************************************/

// Register routes
// all routes prefixed with /api
app.use('/api', router);

// Start server
app.listen(port);
console.log('Server listening on port ' + port);