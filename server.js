var path = require("path");
var express = require("express");//Don't need HTTP, FS, URL requires
var sqlite3 = require("sqlite3");


var app = express();//Create an express app
var port = 8010;

var db_filename = path.join(__dirname, "db", "imdb.sqlite3");//Where server code is and path to file
var public_dir = path.join(__dirname, "public");

var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
	if(err){
		console.log("Error opening "+ db_filename);
	}
	else{
		console.log("Now connected to "+ db_filename);
		//Technially all the code would go in here
		//We worry about asycn issues, but in the end
		//The chances of an issue are so small
	}
});

app.use(express.static(public_dir));//Handles all of our requests

var server = app.listen(port);

