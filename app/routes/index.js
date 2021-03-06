(function () {
    'use strict';
    // JsHint mener jeg skal pakke 'use strict';
    // Ind i en IFFI

    // #Todo JSHint klager over throw, og next parameteren i routen.

    // Import Express og Passport for Auth
    var express	 	= require('express');
    var router 		= express.Router();
    var passport 	= require('passport');

    var User = require('../models/user');
    var Room = require('../models/room');

    // Index
    // #Todo kan jeg fjerne next?
    router.get('/', function(req, res, next) {
        // If isAuthenticated redirect
        // til rum oversigten
        // /rooms
        if(req.isAuthenticated()){
            res.redirect('/rooms');
        }
        else{
            // Render login siden
            // req.flash
            res.render('login', {
                success: req.flash('success')[0],
                errors: req.flash('error'), 
                showRegisterForm: req.flash('showRegisterForm')[0]
            });
        }
    });

    // Login
    router.post('/login', passport.authenticate('local', { 
        successRedirect: '/rooms', 
        failureRedirect: '/',
        failureFlash: true
    }));

    // Create user - Old School
    router.post('/register', function(req, res, next) {

        // Post variablerne req.body.username og req.body.password
        // req.body - requst body
        var credentials = {'username': req.body.username, 'password': req.body.password };

        // If username === '' ingenting samt password
        // Flash error
        // Hent showRegisterForm
        if(credentials.username === '' || credentials.password === ''){
            req.flash('error', 'Write something, dammit..');
            req.flash('showRegisterForm', true);
            res.redirect('/');
        }else{

            // Tjek om brugeren findes
            // Stjålet fra: http://enof.github.io/imber/server/user.html
            User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': null}, function(err, user){
                if(err) throw err;
                if(user){
                    req.flash('error', 'Du findes allerede');
                    req.flash('showRegisterForm', true);
                    res.redirect('/');
                }else{
                    User.create(credentials, function(err, newUser){
                        // JsHint error
                        // #Todo Vil ikke godkende throw - andre måder at lave det på?
                        if(err) throw err;
                        // JsHint error
                        // Mixed single and double quotes - i know
                        req.flash('success', "Yea' du er oprettet");
                        res.redirect('/');
                    });
                }
            });
        }
    });

    /**
     * Login via Social auth
     * Bruges til Facebook og Twitter.
     * Read: http://passportjs.org/docs
     * Kræver AppId og Secret til begge tjenester
     */

    // Login via Facebook
    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/rooms',
        // En BrugerProfil kunne laves via
        // res.redirect('/users/' + req.user.username);
        failureRedirect: '/',
        failureFlash: true
    }));

    // Login via Twitter
    router.get('/auth/twitter', passport.authenticate('twitter'));
    router.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/rooms',
        failureRedirect: '/',
        failureFlash: true
    }));

    // Rum oversigt
    // Tjek om User.isAuthenticated
    router.get('/rooms', [User.isAuthenticated, function(req, res, next) {
        Room.find(function(err, rooms){
            // JSHint
            // #Todo: Klager over Throw - En anden måde?
            if(err) throw err;
            res.render('rooms', { rooms });
        });
    }]);

    // De enkelte rum
    router.get('/chat/:id', [User.isAuthenticated, function(req, res, next) {
        // Hent roomID fra req body
        // req.params.id
        var roomId = req.params.id;
        Room.findById(roomId, function(err, room){
            // JSHint
            // #Todo: Klager over Throw - En anden måde?
            if(err) throw err;
            if(!room){
                return next(); 
            }
            console.log(room.messages);

            res.render('chatroom', { user: req.user, room: room });
            // #Todo add query for chat messages.
        });

    }]);

    // Logout
    // #Todo
    router.get('/ses', function(req, res, next) {

        // Fjern req.user
        req.logout();

        // Kill the session
        req.session = null;

        // Så det ud'
        res.redirect('/');
    });

    // Exporter det hele som
    // router.something - kan så tilgåes
    module.exports = router;

}());
