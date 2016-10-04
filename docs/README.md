
![alt tag](http://www.mikejakobsen.com/mike.png)

# Project Mean Stack Chat

## Indledning



## Mean Stack

## Encryption

https://github.com/kelektiv/node.bcrypt.js

#### To hash a password:

Bruger http://blowfish.cc encryption

Technique 1 (generate a salt and hash on separate function calls):

```javascript
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});
```

#### To check a password:

```javascript
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    // res == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
    // res == false
});
```

```javascript
UserSchema.methods.validatePassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};
```
## Social Login

passport https://github.com/jaredhanson/passport-facebook
passport socket.io https://github.com/jfromaniello/passport.socketio

```javascript
var UserSchema = new Mongoose.Schema({
	username: { type: String, required: true, unique: true, dropDups: true},
	// Default: null da social ikke behøver password
	// og alm bruger ikke behover socialId
	password: { type: String, default: null },
	socialId: { type: String, default: null },
	picture:  { type: String, default:  DEFAULT_USER_PICTURE}
});

	if(!user.picture){
		user.picture = DEFAULT_USER_PICTURE;
	}
```

## Time since function

## Mongoose


