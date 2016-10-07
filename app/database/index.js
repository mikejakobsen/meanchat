(function () {
    'use strict';

    var config 		= require('../config');
    var Mongoose 	= require('mongoose');
    var logger 		= require('../logger');

    // Localhost forbindelse - Chat DB
    Mongoose.connect('mongodb://localhost/mikejakobsenchat');

    // Fejl
    Mongoose.connection.on('error', function(err) {
        if(err) throw err;
    });

    // Får fejl grundet Mongoose promise??! #Todo
    Mongoose.Promise = global.Promise;

    // Hent Mongoose Models
    module.exports = { Mongoose, 
        models: {
        user: require('./schemas/user.js'),
        room: require('./schemas/room.js'),
        messages: require('./schemas/message.js')
    }
    };
}());
