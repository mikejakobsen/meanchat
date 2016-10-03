(function () {
    'use strict';

    var Mongoose 	= require('mongoose');
    // Bcryup for at hash/salt password
    // https://github.com/kelektiv/node.bcrypt.js
    var bcrypt      = require('bcrypt-nodejs');

    // Const da de ikke skal ændres
    const SALTROUNDS = 10;
    const DEFAULT_USER_PICTURE = '/img/user.jpg';

    /**
     * Hver bruger har et username, password, socialId og et picture
     * If the user registered via username and password(i.e. LocalStrategy),
     * Hvis brugeren opretter vil Passport LocalStrategy - Og får username og password
     * så vil socialId være null.
     *
     * Hvis brugeren opretter via Facebook/Twitter.
     * vil password være null, og socialId får så en værdi fra Passport.js
     *
     */

    var UserSchema = new Mongoose.Schema({
        username: { type: String, required: true},
        // Default: null da social ikke behøver password
        // og alm bruger ikke behover socialId
        password: { type: String, default: null },
        socialId: { type: String, default: null },
        picture:  { type: String, default:  DEFAULT_USER_PICTURE}
    });

    /**
     * Før brugeren gemmes.
     * if !user.picture -> giv ham default
     * Social Profil billeder hentes direkte fra url
     * Fx. https://pbs.twimg.com/profile_images/507518430501552129/DBtWTye8_normal.jpeg
     * den får så absolut path til '/img/user.jpg' ellers.
     *
     */
    UserSchema.pre('save', function(next) {
        var user = this;

        // Hvis billedet ikke er defineret -> DEFAULT_USER_PICTURE
        // Const da det er en fast værdi
        if(!user.picture){
            user.picture = DEFAULT_USER_PICTURE;
        }

        // Videre hvis password ikke er blevet ændret
        if (!user.isModified('password')) return next();

        // https://github.com/ncb000gt/node.bcrypt.js/
        // Lav et salt og hash på hver sit funcktion call
        bcrypt.genSalt(SALTROUNDS, function(err, salt) {
            if (err) return next(err);

            // Kør hash på user.password, med det salt vi lige lavede
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) return next(err);

                // overskriv user.password med hash værdien
                // der gemmes.
                user.password = hash;
                next();
            });
        });
    });

    /**
     * Valider brugerens password
     * function til at sammenligne brugerens input med hash værsionen
     * Kilde: http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
     *
     */
    UserSchema.methods.validatePassword = function(password, callback) {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err) return callback(err);
            callback(null, isMatch);
        });
    };

    // Lav User Schemaet
    var userModel = Mongoose.model('user', UserSchema);

    // Eksport userModel
    module.exports = userModel;
}());
