var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//  validator
app.use(expressValidator());

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

// define the routes to the controllers
app.use(require('./controllers'));

// Define router
var app = express.Router();

// Launch dbs
var db = require('./db');
