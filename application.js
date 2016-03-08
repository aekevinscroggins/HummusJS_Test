var express = require("express");
var app = express();
var async = require("async");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var test = require("./test");
var server = null;
var port = 3000;

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan(":method :url :status :remote-addr :response-time ms - :res[content-length]"));

app.all("/*", function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, X-Auth-Token");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
	return next();
});

app.use("*", function(req, res, next) {
	if(!res.locals) {
		res.locals = { };
	}
	
	next();
});

app.use(function(req, res, next) {
	var error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use(function(err, req, res, next) {
	console.error(err.message);
	console.error(err.stack);

	return res.status(err.status || 500).json({
		error: true,
		message: err.message,
		stack: err.stack,
		info: err
	});
});

async.series(
	[
		function(callback) {
			server = app.listen(port, function () {
				var address = server.address().address;
				var port = server.address().port;

				console.log("Current directory: " + process.cwd());

				console.log("API listening at http://%s:%s", address.length == 0 || address == "::" || address == "0.0.0.0" ? "localhost" : address, port);

				return callback();
			});
		},
		function(callback) {
			return test(
				"T183",
				"./Test_T183.pdf",
				"./Output_T183.pdf",
				function(result) {
					return callback();
				},
				function(error) {
					return callback(error);
				}
			);
		},
		/*function(callback) {
			return test(
				"T1",
				"./Test_T1.pdf",
				"./Output_T1.pdf",
				function(result) {
					return callback();
				},
				function(error) {
					return callback(error);
				}
			);
		},*/
		function(callback) {
			return test(
				"RC71",
				"./Test_RC71.pdf",
				"./Output_RC71.pdf",
				function(result) {
					return callback();
				},
				function(error) {
					return callback(error);
				}
			);
		},
		/*function(callback) {
			return test(
				"T1013",
				"./Test_T1013.pdf",
				"./Output_T1013.pdf",
				function(result) {
					return callback();
				},
				function(error) {
					return callback(error);
				}
			);
		}*/
	],
	function(error) {
		if(error) {
			return console.error("Failed to start server: " + (error.message ? error.message : JSON.stringify(error)));
		}

		return console.log("Test completed successfully!");
	}
);
