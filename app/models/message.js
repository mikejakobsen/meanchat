// #Todo not connected
(function () {
    'use strict';

    // Import roomModel og User model
    var roomModel   = require('../database').models.room;
    var User 		= require('../models/user');

    addMessage: function(roomId, message){
        // When a new message arrives
        socket.on('newMessage', function(roomId, message) {

            socket.broadcast.to(roomId).emit('addMessage', message);
            // #Todo - Save message
            console.log(message);
        });

        module.exports = { 
            saveMessage, 
        };
    };

}());
