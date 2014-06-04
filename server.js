// server.js

// Base Setup

// Call required packages
var http = require('http');
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

// Register routes
// all routes prefixed with /api
app.use('/api', router);

// Start server
app.listen(port);
console.log('Server listening on port ' + port);