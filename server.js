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
	}
});

app.use(express.static(public_dir));//Handles all of our requests

app.get("/login", (req,res)=>{//Login
	var req_url = url.parse(req.url);//give username and password;
	console.log(req_url);//The thing we want is the query
	var query = decodeURI(req_url.query).replace(/\*/g, "%");;//Decode special characters " " = %20 etc.
	var splitQuery = query.split("|||");
	var username = splitQuery[0];
	var password = splitQuery[1];
	var password = md5(password);//Encrypt the password
	console.log("Username: "+username+" Password: "+password);
	console.log("SELECT * FROM users WHERE name = ?"+username);
	db.get("SELECT * FROM users WHERE name = ?",[username], (err, row) =>{//Use ? because of SQL injection prevention
		if(err){//Check if there is a error
			console.log("there was an error");
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


app.post("/login",(req,res)=>{//NEW USER
	var req_url = url.parse(req.url);//give username and password;
	console.log(req_url);//The thing we want is the query
	var query = decodeURI(req_url.query).replace(/\*/g, "%");;//Decode special characters " " = %20 etc.
	var splitQuery = query.split("|||");
	var username = splitQuery[0];
	var password = splitQuery[1];
	var password = md5(password);//Encrypt the password
	console.log("Username: "+username+" Password: "+password);
	db.get("SELECT * FROM users WHERE name = ?",[username], (err, row) =>{//Use ? because of SQL injection prevention
		console.log("Inside initial select search");
		if(err){//Check if there is a error
			console.log("there was an error");
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

app.post("/update",(req,res)=>{//NEW USER
	var req_url = url.parse(req.url);//give username and password;
	console.log(req_url);//The thing we want is the query
	var query = decodeURI(req_url.query).replace(/\*/g, "%");;//Decode special characters " " = %20 etc.
	var splitQuery = query.split("|||");
	console.log(splitQuery);
	var username = splitQuery[0];
	var games = splitQuery[1];
	var sql = "UPDATE users SET gamesplayed = "+games+" WHERE name = ?"
	if(splitQuery.length > 2){
		var score = splitQuery[2];
		sql = "UPDATE users SET gamesplayed = "+games+", highscore = "+score+" WHERE name = ?"
	}
	db.run(sql,[username], (err, row) =>{//Use ? because of SQL injection prevention
		if(err){//Check if there is a error
			console.log("there was an error");
			res.writeHead(500, {"Content-Type": "test/plain"});
			res.write("There was an error");
			res.end();
		}
		else{
			console.log("Sending update");
			var send = {sending:score};
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(send));
			res.end();
		}
	});
});


app.get("/leader", (req,res)=>{//Login
	console.log("SELECT * FROM users");
	db.all("SELECT highscore,name FROM users ORDER BY highscore DESC",(err, rows) =>{//Use ? because of SQL injection prevention
		if(err){//Check if there is a error
			console.log("Getting leaderboard: there was an error");
			res.writeHead(500, {"Content-Type": "test/plain"});
			res.write(JSON.stringify(problem));
			res.end();
		}
		else{
			console.log(rows);
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(rows));
			res.end();
		}
	});//db
});//leaderboard
app.get('/names/:name', (req,res)=>{
	console.log(req.params);
	db.get('SELECT * FROM users Names WHERE name= ?',[req.params.name],(err, rows)=> {
	if(err){//Check if there is a error
		res.writeHead(500, {"Content-Type": "text/plain"});
		res.end();
	}else{
		console.log(rows);
		res.writeHead(200, {"Content-Type": "application/json"});
		res.write(JSON.stringify(rows));
		res.end();
	}
	});//use to get first row.
});

/*********************
WEB SOCKET
*********************/
var wss = new WebSocket.Server({server: server});
var clients = [];
var client_count = 0;
var message;
var chat_history = [];
wss.on("connection", (ws) => {//On connection to client
	var client_id = ws._socket.remoteAddress + ":" + ws._socket.remotePort;//IPAddress and port
	console.log("New connection: " + client_id);
	clients.push(ws);
	client_count++;//Increment on connection
	ws.room = "";
	ws.on("message", (message) => {
		var messag = JSON.parse(message); //{type,data}
		if(messag.type === "username"){//They send username
			ws.username = messag.data;
			console.log("Username:"+ws.username);
		}else if(messag.type ==="roomname"){
			ws.room = messag.data;
			console.log("Roomname: "+ws.room);
//			broadcast(JSON.stringify({type:"roommate",data:"username"}));
		}
		else if(messag.type === "msg"){//They are sending text
			console.log("Message from " + client_id + "("+messag.data.sender+"): " + messag.data.text +"|END");
			chat_history.push(messag.data);//Sending only the data
			broadcast(message);//Send message to everone in room
		}
	});//on message
	ws.on("close", () => {
		console.log("Client disconnected: " + client_id);
		delete clients[client_id];
		client_count--;//Decrement on close
		//Send the message to everyone
	});
	SendChatHistory(ws);
});//Successful connection to server

//IF IT'S THE SAME MAKE A FUNCTION
//
function updateClientCount(){
	var id;
	message = {type: "client_count", data: client_count};//CLIENT COUNT IS A GLOBAL VARIABLE
	Broadcast(JSON.stringify(message));
}//*/

function broadcast(message){//This is an object
	clients.forEach((client)=>{
		console.log(client.room);
		if(client.room.indexOf(JSON.parse(message).data.room)>-1){
			console.log("Sending "+message+" to "+client.username);
			client.send(message);
		}
	});
}

function SendChatHistory(ws){
	console.log("We are sending chat history");
	var room_specific_chat = [];
	chat_history.forEach((message)=>{
		if(message.room == ws.room){
			room_specific_chat.push(message);
		}
	});
	var history = {type:"history", data: room_specific_chat};
	ws.send(JSON.stringify(history));
}

server.listen(port, "0.0.0.0");//websocketing webserver
console.log("Now listening on port "+port);
