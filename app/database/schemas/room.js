(function () {
    'use strict';

    var Mongoose  = require('mongoose');

    ////var message = require('./message.js');


    /**
     * Hver forbindelse er en bruger forbundet via en socket
     * Hver forbindelse er et userId + socketID
     *
     */

    var MessageSchema = Mongoose.Schema({
        content: { type: String, required: true},
        date: { type: Date, default: Date.now },
        username: { type: String, required: true}
    });

    var RoomSchema = new Mongoose.Schema({
        // #Todo add more validation
        title: { type: String },
        connections: { type: [{ userId: String, socketId: String }]},
        messages: [MessageSchema]
    });

    var roomModel = Mongoose.model('room', RoomSchema);


    // Gør den generelt tilgængelig
    module.exports = roomModel;
}());
