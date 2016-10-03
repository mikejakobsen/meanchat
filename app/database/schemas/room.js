(function () {
    'use strict';

    var Mongoose  = require('mongoose');

    /**
     * Hver forbindelse er en bruger forbundet via en socket
     * Hver forbindelse er et userId + socketID
     *
     */
    var RoomSchema = new Mongoose.Schema({
        // #Todo add more validation
        title: { type: String, required: true },
        connections: { type: [{ userId: String, socketId: String }]}
    });

    var roomModel = Mongoose.model('room', RoomSchema);

    // Gør den generelt tilgængelig
    module.exports = roomModel;
}());
