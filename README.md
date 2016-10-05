
![alt tag](http://www.mikejakobsen.com/mike.png)

# Project Mean Stack Chat

## Indledning

Excersise description http://www.mikejakobsen.com/stuff/mandatory-1.pdf

## File Structure

# Project tree

.
* [README.md](./README.md)
* [app](./app)
* [auth](./app/auth)
	* [index.js](./app/auth/index.js)
* [database](./app/database)
	* [index.js](./app/database/index.js)
	* [schemas](./app/database/schemas)
	* [message.js](./app/database/schemas/message.js)
	* [room.js](./app/database/schemas/room.js)
	* [user.js](./app/database/schemas/user.js)
* [logger](./app/logger)
	* [index.js](./app/logger/index.js)
* [models](./app/models)
	* [message.js](./app/models/message.js)
	* [room.js](./app/models/room.js)
	* [user.js](./app/models/user.js)
* [routes](./app/routes)
	* [index.js](./app/routes/index.js)
* [session](./app/session)
	* [index.js](./app/session/index.js)
* [views](./app/views)
	* [chatroom.ejs](./app/views/chatroom.ejs)
	* [head.ejs](./app/views/head.ejs)
	* [login.ejs](./app/views/login.ejs)
	* [rooms.ejs](./app/views/rooms.ejs)
* [config](./app/config)
	* [index.js](./app/config/index.js)
	* [config.json](./app/config/config.json)
* [socket](./app/socket)
* [index.js](./app/socket/index.js)
* [bower.json](./bower.json)
* [package.json](./package.json)
* [server.js](./server.js)
* [src](./src)
* [img](./src/img)
	* [user.jpg](./src/img/user.jpg)
* [js](./src/js)
	* [login.js](./src/js/login.js)
	* [main.js](./src/js/main.js)
	* [rooms.js](./src/js/rooms.js)
* [styles](./src/styles)
* [app.sass](./src/styles/app.sass)
* _[variables.sass](./src/styles/variables.sass)
* [static](./static)
* [css](./static/css)
	* [app.css](./static/css/app.css)
* [img](./static/img)
	* [user.png](./static/img/user.png)
* [js](./static/js)
* [login.js](./static/js/login.js)
* [main.js](./static/js/main.js)
* [rooms.js](./static/js/rooms.js)
* [docs](./docs)
* [README.md](./docs/README.md)
* [gulpfile.js](./gulpfile.js)



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

Moment.js http://momentjs.com/docs/

```javascript
<<%= moment(message.date).fromNow() %>
```

## Mongoose


