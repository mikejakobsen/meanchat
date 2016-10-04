(function () {
    'use strict';

    var config 	= require('../config');
    var redis 	= require('redis').createClient;
    var adapter = require('socket.io-redis');
    var Mongoose = require('mongoose');

    var Room = require('../models/room');
    var messageModel = require('../database').models.messages;

    /**
     * Socket Events
     *
     */
    var ioEvents = function(io) {

        // Rooms namespace
        io.of('/rooms').on('connection', function(socket) {

            // Opret et nyt rum
            socket.on('createRoom', function(title) {
                Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room){
                    if(err) throw err;
                    if(room){
                        socket.emit('updateRoomsList', { error: 'Findes allerede' });
                    } else {
                        // Kalder create - hvis rummet ikke findes
                        Room.create({ 
                            title: title
                        }, function(err, newRoom){
                            if(err) throw err;
                            socket.emit('updateRoomsList', newRoom);
                            socket.broadcast.emit('updateRoomsList', newRoom);
                        });
                    }
                });
            });
        });

        // Chatroom namespace
        io.of('/chatroom').on('connection', function(socket) {

            // Join chatroom
            socket.on('join', function(roomId) {
                Room.findById(roomId, function(err, room){
                    if(err) throw err;
                    if(!room){
                        // Join Room -> By id
                        // Hvis stien ikke findes
                        socket.emit('updateUsersList', { error: 'Room doesnt exist.' });
                    } else {
                        //  Har brugeren allerede en session - return void
                        //  #Todo - burde det være ===?
                        if(socket.request.session.passport == null){
                            return;
                        }

                        Room.addUser(room, socket, function(err, newRoom){

                            // Join rummet
                            socket.join(newRoom.id);

                            Room.getUsers(newRoom, socket, function(err, users, countUserInRoom){
                                if(err) throw err;

                                // Return -> listen med alle brugeren til den forbundne bruger
                                socket.emit('updateUsersList', users, true);

                                // Return list til alle andre
                                if(countUserInRoom === 1){
                                    socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
                                }
                            });
                        });
                    }
                });
            });

            // Når de smutter igen -> disconnect
            socket.on('disconnect', function() {

                // Check if user exists in the session
                if(socket.request.session.passport == null){
                    return;
                }

                // Find the room to which the socket is connected to, 
                // and remove the current user + socket from this room
                Room.removeUser(socket, function(err, room, userId, countUserInRoom){
                    if(err) throw err;

                    // Leave the room channel
                    socket.leave(room.id);

                    // Return the user id ONLY if the user was connected to the current room using one socket
                    // The user id will be then used to remove the user from users list on chatroom page
                    if(countUserInRoom === 1){
                        socket.broadcast.to(room.id).emit('removeUser', userId);
                    }
                });
            });

            // When a new message arrives
            socket.on('newMessage', function(roomId, message) {

                // No need to emit 'addMessage' to the current socket
                // As the new message will be added manually in 'main.js' file
                // socket.emit('addMessage', message);

                var msg = new messageModel ({
                    content: message.content,
                    username: message.username,
                    date: message.date,
                    roomId: roomId
                });

                var saveMessage = function (msg, callback){
                    // #Todo - Constructor skal starte med stort #roomModel
                    var newMessage = new messageModel(msg);
                    newMessage.save(callback);
                };


                msg.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Besked Gemt');
                    }
                });

                console.log(msg);

                /*
                   var newMsg = function (msg) {
                   messageModel.findOneAndUpdate(
                   {content: content},
                   {username: username},
                   {date: date},
                   {upsert: true},
                   function (err, doc)

                   ));
                   */
                // Print beskeden via Socket
                socket.broadcast.to(roomId).emit('addMessage', message);

            });

        });
    };

    /**
     * Initialize Socket.io
     * Uses Redis as Adapter for Socket.io
     *
     */
    var init = function(app){

        var server 	= require('http').Server(app);
        var io 		= require('socket.io')(server);

        // Force Socket.io to ONLY use "websockets"; No Long Polling.
        io.set('transports', ['websocket']);

        // Using Redis
        let port = config.redis.port;
        let host = config.redis.host;
        let password = config.redis.password;
        let pubClient = redis(port, host, { authPass: password });
        let subClient = redis(port, host, { authPass: password, return_buffers: true, });
        io.adapter(adapter({ pubClient, subClient }));

        // Allow sockets to access session data
        io.use((socket, next) => {
            require('../session')(socket.request, {}, next);
        });

        // Define all Events
        ioEvents(io);

        // The server object will be then used to list to a port number
        return server;
    }

    module.exports = init;
}());
