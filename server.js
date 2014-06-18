// server.js

// Base Setup

// Call required packages

var express 		= require('express'),
	app 			= express(),
	router 			= express.Router(),
	bodyParser 		= require('body-parser'),
	async 			= require('async'),
	globals 		= require('globals'),
	authenticate 	= require('authenticate'),
	users 			= require('users');

// Configure app to use bodyParser()
// Allows us to get the data from a POST
app.use(bodyParser());

// Set port
var port = process.env.PORT || globals.port_default;

// Routes for API
router.get('/', function(req, res) {
	res.json({ message: "HELLO FROM THE API!" });
});

/***AUTHENTICATION************************************************************/

router.post('/login', function( req, res ) {
	async.series([
		function( callback ) {
			authenticate.login( req.body, callback );
		}
	], function( err, results ) {
		res.send( results[0] );
	});
});

router.post('/logout', function( req, res ) {
	async.series([
		function( callback ) {
			authenticate.logout( req.body, callback );
		}
	], function( err, results ) {
		res.send( results[0] );
	});
});

/***USERS*********************************************************************/

router.get('/users', function( req, res ) {
	async.series([
		function( callback ) {
			users.profile( req.query, callback );
		}
	], function( err, results ) {
		res.send( results );
	});
});

router.post('/users', function( req, res ) {
	// If profile does not throw error means username has been taken
	async.series([
		function( callback ) {
			users.profile( req.body, callback );
		}
	], function( err, results ) {
		if( !err ) {
			var response = {
				result: 'failure',
				error: 'Email already registered.'
			}
			res.send( response );
		}
		else {
			// Proceed with registration
			async.series([
				function( callback ) {
					users.register( req.body, callback );
				}
			], function( err, results ) {
				if( err ) {
					res.send( results[0] );
				}
				else {
					async.series([
						function( callback ) {
							authenticate.login( req.body, callback );
						}
					], function( err, results ) {
						res.send( results[0] );
					});
				}
			});
		}
	});
});

/***QUESTIONS*****************************************************************/

router.get('/questions', function(req, res) {
	var connection = mysql.createConnection(globals.db_params);

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
	var connection = mysql.createConnection(globals.db_params);

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