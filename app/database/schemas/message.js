(function () {
    'use strict';

    var Mongoose = require('mongoose');

    /**
     * Beskeder
     *
     */

    var MessageSchema = new Mongoose.Schema({
        message: { type: String, required: true}
    });

    var messageModel = Mongoose.model('message', MessageSchema);

    // Eksporter Schemaet
    module.exports = messageModel;
}());
