(function () {
    'use strict';

    var Mongoose = require('mongoose');

    /**
     * Beskeder
     *
     */

    var MessageSchema = new Mongoose.Schema({
        content: { type: String, required: true},
        date: { type: Date, default: Date.now },
        username: { type: String, required: true}
    });

    var messageModel = Mongoose.model('message', MessageSchema, 'rooms.roomId');

    // Eksporter Schemaet
    module.exports = messageModel;
}());
