(function () {
'use strict';
// JsHint mener jeg skal pakke 'use strict';
// Ind i en IFFI

// Hent user model fra Mongoose
var userModel = require('../database').models.user;

// Lav bruger function 
var create = function (data, callback){
    // TODO - Constructor starter med Stort - JSHint
	var newUser = new userModel(data);
	newUser.save(callback);
};

// Find bruger function
var findOne = function (data, callback){
	userModel.findOne(data, callback);
};

// Find vi ObjectID - For at bruge ID til beskeder
var findById = function (id, callback){
	userModel.findById(id, callback);
};


/**
 * FindOrCreate - Find bruger - Findes ikke - så lav ham
 * Bruges til Facebook og Twitter.
 * Findes ikk? = opret ham
 * Kilde: https://github.com/jaredhanson/passport-facebook
 *
 */
var findOrCreate = function(data, callback){
	findOne({'socialId': data.id}, function(err, user){
		if(err) { return callback(err); }
		if(user){
			return callback(err, user);
		}else{
			create({
				username: data.displayName,
				socialId: data.id,
				picture: data.photos[0].value || null
			}, function(err, newUser){
				callback(err, newUser);
			});
		}
	});
};

/**
 * Middleware - redirecter til / - hvis brugeren ikke er logged ind 
 *
 */
var isAuthenticated = function (req, res, next) {
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/');
	}
};

// Exporter functionerne
module.exports = { 
	create, 
	findOne, 
	findById, 
	findOrCreate, 
	isAuthenticated 
};
}());
