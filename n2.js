// ----------------------
// Server TCP Simple
// ----------------------
var net = require('net');

// Le tableau des connexions
var sockets = [];

/*
* Cleans the input of carriage return, newline
*/
function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function f_who(socket) {
	var r = "";
	r  = "Liste des connexions\n";
	r += "--------------------\n";
	for(var i = 0; i<sockets.length; i++) {
		var l = "";
		if (sockets[i] !== socket) {
			l = " ";
		}
		else {
			l = ">";
		}

		r += l+"-"+sockets[i].remoteAddress+':'+sockets[i].remotePort+'\n';
	}
	r += "\n";
	return r;
}

/*
* Callback method executed when data is received from a socket
*/

// Quand une socket recoit des donnees
function receiveData(socket, data) {
	var cleanData = cleanInput(data);
	switch(cleanData) {
		case "QUIT":
			socket.end('Good Bye ! \n');
			break;
		case "WHO":
			socket.write( f_who(socket) );
			break;
		default:
			socket.write(' You said : ' + data );
	}
}

/*
* Method executed when a socket ends
*/
function closeSocket(socket) {
	var i = sockets.indexOf(socket);
	if (i != -1) {
		sockets.splice(i, 1);
	}
}

function srv_log(socket, msg) {
	console.log('>' + socket.remoteAddress +':'+ socket.remotePort + '-' + msg);
}

/*
* Callback method executed when a new TCP socket is opened.
*/
function newSocket(socket) {
	sockets.push(socket);
	socket.write('Welcome to the Telnet server!\n');
	srv_log(socket, 'Connected');
	// Quand on recoit des donnees
	socket.on('data', function(data) {
		srv_log(socket, 'Rcv data' );
		receiveData(socket, data);
	})
	// demande de fin de connexion de la part du client
	socket.on('end', function() {
		srv_log(socket, 'End Connexion');
		closeSocket(socket);
	})
}

// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);

console.log("Telnet server start ...");

// Listen on port 1337
server.listen(1337);
