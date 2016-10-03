(function () {
'use strict';
// JsHint mener jeg skal pakke 'use strict';
// Ind i en IFFI

// Import roomModel og User model
var roomModel   = require('../database').models.room;
var User 		= require('../models/user');

// Gem functioner fra roomModel i localScope
var create = function (data, callback){
    // #Todo - Constructor skal starte med stort #roomModel
	var newRoom = new roomModel(data);
	newRoom.save(callback);
};

var find = function (data, callback){
	roomModel.find(data, callback);
};

var findOne = function (data, callback){
	roomModel.findOne(data, callback);
};

var findById = function (id, callback){
	roomModel.findById(id, callback);
};

/*
var findByIdAndUpdate = function(id, data, callback){
	roomModel.findByIdAndUpdate(id, data, { new: true }, callback);
};
/*

/**
 * Tilføj bruger, sammen med Socket
 *
 */
var addUser = function(room, socket, callback){
	
	// Hent BrugerID
	var userId = socket.request.session.passport.user;

	// Push en ny forbindelse {userId + socketId}
	// Read: http://stackoverflow.com/questions/35036805/socket-io-doesnt-work-both-way/35039060
	var conn = { userId: userId, socketId: socket.id};
	room.connections.push(conn);
    // #Todo er callback nødvendig?
	room.save(callback);
};

/**
 *  Hent alle brugere
 *  Måske bruge passport.socket.io i stedet
 *  https://github.com/jfromaniello/passport.socketio
 */
var getUsers = function(room, socket, callback){

	var users = [], vis = {}, cunt = 0;
	var userId = socket.request.session.passport.user;

    // ForEach forbindelse til room, then ->
	room.connections.forEach(function(conn){

		// Tjek om brugeren har forbindlse - tilføj ham #cunt++
		if(conn.userId === userId){
			cunt++;
		}

        // Lav et array med alle brugeren, for at vise de aktive
        // Henter UserID for at printe profilbillede
		if(!vis[conn.userId]){
			users.push(conn.userId);
		}
		vis[conn.userId] = true;
	});

	users.forEach(function(userId, i){
        // Hent brugerens ID (findById)
        // Tiløj til bruger array
        // = Opret et users object
		User.findById(userId, function(err, user){
			if (err) { return callback(err); }
			users[i] = user;
			if(i + 1 === users.length){
				return callback(null, users, cunt);
			}
		});
	});
};

/**
 * Fjern Bruger - når forbindelsen ryder
 *
 */
var removeUser = function(socket, callback){

	// Hent brugerID fra Socket.io
	// Read: http://www.scotthasbrouck.com/blog/2016/3/18/passportjs-express-session-with-sockeio
	var userId = socket.request.session.passport.user;

	find(function(err, rooms){
		if(err) { return callback(err); }

        // Gennemgå hvert rum ->
		rooms.every(function(room){
			var pass = true, cunt = 0, target = 0;

			// ForEach loop på rummet
			// Tjek om brugeren har forbindelse - samme funktion, som ved login
			room.connections.forEach(function(conn, i){
				if(conn.userId === userId){
					cunt++;
				}
				if(conn.socketId === socket.id){
					pass = false, target = i;
				}
			});

			// !pass - smid brugeren ud.
			if(!pass) {
				room.connections.id(room.connections[target]._id).remove();
				room.save(function(err){
					callback(err, room, userId, cunt);
				});
			}

			return pass;
		});
	});
};

// Export modules
module.exports = { 
	create, 
	find, 
	findOne, 
	findById, 
	addUser, 
	getUsers, 
	removeUser 
};
}());
