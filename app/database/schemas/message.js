(function () {
    'use strict';

    var Mongoose = require('mongoose');

    /**
     * Beskeder
     *
     */

    var MessageSchema = Mongoose.Schema({
        content: { type: String, required: true},
        date: { type: Date, default: Date.now },
        username: { type: String, required: true}
    });


    module.exports = Mongoose.model('message', MessageSchema);


    // Eksporter Schemaet
    //module.exports = messageModel;
    //module.exports = MessageSchema;
    //module.exports = { MessageSchema: MessageSchema, messageModel: messageModel }
}());
