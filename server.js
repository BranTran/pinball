var path = require("path");
var http = require("http");
var url = require("url");
var express = require("express");//Don't need HTTP, FS, URL requires
var sqlite3 = require("sqlite3");
var WebSocket = require("ws");//The websocketing
var md5 = require("md5");//Encrypting data

var app = express();//Create an express app
var server = http.createServer(app);
var port = 8010;

var db_filename = path.join(__dirname, "db", "pinball.sqlite3");//Where server code is and path to file
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
});//*/
app.use(express.static(public_dir));//Handles all of our requests




//*********************
// 	WEB SOCKET
//*********************
var wss = new WebSocket.Server({server: server});
var clients = {};
var client_count = 0;
var message;
wss.on('connection', (ws) => {//On connection to client
    var client_id = ws._socket.remoteAddress + ":" + ws._socket.remotePort;//IPAddre$

    console.log('New connection: ' + client_id);
    clients[client_id] = ws;
    client_count++;//Increment on connection

    ws.on('message', (message) => {
        console.log('Message from ' + client_id + ': ' + message);
    });
    ws.on('close', () => {
        console.log('Client disconnected: ' + client_id);
        delete clients[client_id];
        client_count--;//Decrement on close

        message = {msg: 'delete_client', data: client_count};
        for (id in clients) {
                if (clients.hasOwnProperty(id)) {
                        clients[id].send(JSON.stringify(message));
                }
        }
    });
    var id;
    message = {msg: 'client_count', data: client_count};
    for (id in clients) {
        if (clients.hasOwnProperty(id)) {

            clients[id].send(JSON.stringify(message));//Send message to all clients $
        }
    }
});//Connection success


//var server = app.listen(port);//OLD
server.listen(port, '0.0.0.0');//websocketing webserver
console.log("Now listening on port "+port);
