var path = require("path");
var http = require("http");
var url = require("url");
var express = require("express");//Don't need HTTP, FS, URL requires
var sqlite3 = require("sqlite3");
var WebSocket = require("ws");//The websocketing
var md5 = require("md5");//Encrypting data
var session = require("express-session");




var app = express();//Create an express app
var server = http.createServer(app);
var port = 8010;

var db_filename = path.join(__dirname, "db", "pinball.sqlite3");//Where server code is and path to file
var public_dir = path.join(__dirname, "public");
var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
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
//app.use(session({secret:"CISC375PinballFinalProject"}));


app.get("/User", (req,res) => {//LOGIN
	//	if(res.session.username){
	//		res.redirect('login');
	//	}
	//	else {
	//		res.redirect('signup');
	//	}
});
app.get('/login', (req,res)=>{//Login
	var req_url = url.parse(req.url);//give username and password;
	console.log(req_url);//The thing we want is the query
	var query = decodeURI(req_url.query).replace(/\*/g, '%');;//Decode special characters " " = %20 etc.
	var splitQuery = query.split("|||");
	var username = splitQuery[0];
	var password = splitQuery[1];
	var password = md5(password);//Encrypt the password
	console.log("Username: "+username+" Password: "+password);
	//query.replace(/\*/g, "%");//Wildcard: give me everything with this in the title
	//console.log(query);//Text that we want.
	console.log("SELECT * FROM users WHERE name = ?"+username);
	db.get("SELECT * FROM users WHERE name = ?",[username], (err, row) =>{//Use ? because of SQL injection prevention
		// Use LIKE instead of '=' because of the wildcards
		//		console.log(row);
		if(err){//Check if there is a error
			console.log('there was an error');
			res.writeHead(500, {"Content-Type": "test/plain"});
			res.write(JSON.stringify(problem));
			res.end();
		}
		else{
			if(row === undefined){//DID NOT FIND USER
				row = {found_user:0};
			}
			else{
				if(row.passwd == password){
					row.goodpassword = 1;
					row.found_user = 1;

				}else{//NO MATCHING PASSWD
					row = {found_user: 1, goodpassword: 0};
				}
			}
			console.log(row);
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(row));
			res.end();
		}
	});//db


});
app.post('/login',(req,res)=>{//NEW USER
	var req_url = url.parse(req.url);//give username and password;
	console.log(req_url);//The thing we want is the query
	var query = decodeURI(req_url.query).replace(/\*/g, '%');;//Decode special characters " " = %20 etc.
	var splitQuery = query.split("|||");
	var username = splitQuery[0];
	var password = splitQuery[1];
	var password = md5(password);//Encrypt the password
	console.log("Username: "+username+" Password: "+password);
	db.get("SELECT * FROM users WHERE name = ?",[username], (err, row) =>{//Use ? because of SQL injection prevention
		console.log("Inside initial select search");
		if(err){//Check if there is a error
			console.log('there was an error');
			res.writeHead(500, {"Content-Type": "test/plain"});
			res.write("There was an error");
			res.end();
		}
		else{
			console.log("Search went good");
			if(row === undefined){//Not found
				console.log("Did not find it in rows so new user: "+username+" and password: "+password);
				var sql = "INSERT INTO users VALUES(?,?,?,?,?)";
				db.all(sql,[username,password,0,0,0], (inserterr,nothing) => {//Use ? because of SQL injection prevention
					// Use LIKE instead of '=' because of the wildcards
					console.log("Ran insert, doing callback function");
    			if(inserterr){//Check if there is a error
						console.log(inserterr);
						res.writeHead(501, {"Content-Type": "text/plain"});
						res.write("Failed to have things working");
						res.end();
					}else{
						console.log("Inserted "+username);
						var send = {inserted:1};
						console.log("Final check"+ send);
						res.writeHead(200, {"Content-Type": "application/json"});
						res.write(JSON.stringify(send));
						res.end();
					}
				});//db
			}else{
				console.log("Failed to insert since there is already a user with this username");
				var send = {inserted:0};
				console.log("Final check"+ send);
				res.writeHead(200, {"Content-Type": "application/json"});
				res.write(JSON.stringify(send));
				res.end();
			}
		}
	});
});

app.post('/update',(req,res)=>{//NEW USER
	var req_url = url.parse(req.url);//give username and password;
	console.log(req_url);//The thing we want is the query
	var query = decodeURI(req_url.query).replace(/\*/g, '%');;//Decode special characters " " = %20 etc.
	var splitQuery = query.split("|||");
	var username = splitQuery[0];
	var score = splitQuery[1];
	console.log("Username: "+username+" Score: "+score);
	db.run("UPDATE users SET highscore = "+score+" WHERE name = ?",[username], (err, row) =>{//Use ? because of SQL injection prevention
		console.log("Inside initial select search");
		if(err){//Check if there is a error
			console.log('there was an error');
			res.writeHead(500, {"Content-Type": "test/plain"});
			res.write("There was an error");
			res.end();
		}
		else{
			console.log("Sending response");
			var send = {sending:score};
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(send));
			res.end();
		}
	});
});





	//*********************
	// 	WEB SOCKET
	//*********************
	// var wss = new WebSocket.Server({server: server});
	// var clients = {};
	// var rooms = {}
	// var client_count = 0;
	// var message;
	// wss.on('connection', (ws) => {//On connection to client
	//     var client_id = ws._socket.remoteAddress + ":" + ws._socket.remotePort;//IPAddre$
	//
	//     console.log('New connection: ' + client_id);
	//     clients[client_id] = ws;
	//     client_count++;//Increment on connection
	//
	//     ws.on('message', (message) => {
	//         console.log('Message from ' + client_id + ': ' + message);
	//     });
	//     ws.on('close', () => {
	//         console.log('Client disconnected: ' + client_id);
	//         delete clients[client_id];
	//         client_count--;//Decrement on close
	//
	//         message = {msg: 'delete_client', data: client_count};
	//         for (id in clients) {
	//                 if (clients.hasOwnProperty(id)) {
	//                         clients[id].send(JSON.stringify(message));
	//                 }
	//         }
	//     });
	//     var id;
	//     message = {msg: 'client_count', data: client_count};
	//     for (id in clients) {
	//         if (clients.hasOwnProperty(id)) {
	//
	//             clients[id].send(JSON.stringify(message));//Send message to all clients $
	//         }
	//     }
	// });//Connection success


	//var server = app.listen(port);//OLD
	server.listen(port, '0.0.0.0');//websocketing webserver
	console.log("Now listening on port "+port);
