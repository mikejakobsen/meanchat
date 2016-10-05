
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
* [variables.sass](./src/styles/variables.sass)
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

Dependencies:

* [Passport](https://github.com/jaredhanson/passport-facebook)
* [Passport Local](https://github.com/jfromaniello/passport.socketio)
* [Passport Twitter](https://github.com/jfromaniello/passport.socketio)
* [Passport Facebook](https://github.com/jfromaniello/passport.socketio)


Når brugeren indledningsvis tilgår applikationen, og dermed `/` tilgår han ligeledes nedenstående conditional statement.

Der i tilfældet at den besøgende har en instance af [IsAuthenticated](https://github.com/mikejakobsen/meanchat/blob/Date-fix/app/models/user.js#L55) bliver ledt videre til `/Rooms`. Ellers tilgår brugeren `/login` med tilhørende [Connect-Flash](https://github.com/jaredhanson/connect-flash) statusmeddelelse. Der enten viser en viser eventuelle fejlmeddelelser, eller leder den besøgende videre til `showRegisterForm`.

```javascript
// Index route
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
```
## Oprettelse af brugeren

I tilfælde af at brugeren ønsker at oprette sig via `credentials`. Poster han indledningsvis to variabler der tilgåes i `request bodyen`, og gemmes i credentials variablen.
Denne variable tjekkes dernæst for indhold, i tilfældet at variablen er tom, og brugeren dermed intet har skrevet. Tilgåer brugeren en fejlmeddelelse via [Connect-flash](https://github.com/mikejakobsen/meanchat/blob/a48ee2fcccf62e3fe307ae5e241b9ff7c8b6c834/server.js#L8) middlewaren. Hvis conditional statementen derimod evalueres til false, tjekkes brugerens indtastninger op imod databasens [Users collection](https://github.com/mikejakobsen/meanchat/blob/Date-fix/app/database/schemas/user.js#L24).
Findes brugeren, tilgår den besøgende igen en fejlmeddelelse. Evalueres den derimod til false. Laves en instance af [UserSchema](https://github.com/mikejakobsen/meanchat/blob/Date-fix/app/database/schemas/user.js#L24), der dermed gemmer brugeren i databasen.


```javascript
// Create user
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
		User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': null}, function(err, user){
			if(err) throw err;
			if(user){
				req.flash('error', 'Du findes allerede');
				req.flash('showRegisterForm', true);
				res.redirect('/');
			}else{
				User.create(credentials, function(err, newUser){
					if(err) throw err;
					req.flash('success', "Yea' du er oprettet");
					res.redirect('/');
				});
			}
		});
	}
});
```
Brugeren modeleres dernæst fra UserSchema [user.js](./app/database/schemas/user.js#L24).

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
Og gemmes dernæst i databasen, i henhold til userschemaet. Den angivne kode encrypteres [andetsteds](https://github.com/mikejakobsen/meanchat/blob/Date-fix/app/database/schemas/user.js#L55) via [bCryptjs](https://github.com/kelektiv/node.bcrypt.js) og Blowfish algoritmen.

```javascript
{
    "_id" : ObjectId("57f5254ebdea2efa75055256"),
    "username" : "Sarah Frost",
    "picture" : "/img/user.jpg",
    "socialId" : null,
    "password" : "$2a$10$/JWVwNGlfozx8DauFwnnZeSvZXBmxGbOdM.gm7NK2rUfVZRBFqy12",
}
```

## Time since function

Moment.js http://momentjs.com/docs/

```javascript
<%= moment(message.date).fromNow() %>
```

## Mongoose

### Dependencies


## Brugte moduler

* [Bcrypt-nodejs](https://github.com/mikejakobsen/meanchat/tree/Date-fix)
* [Body-parser](https://github.com/expressjs/body-parser)
* [Connect-flash](https://github.com/jaredhanson/connect-flash)
* [Connect-mongo](https://github.com/jdesboeufs/connect-mongo)
* [Ejs](https://github.com/mde/ejs)
* [Express](https://github.com/expressjs/express)
* [Express-session](https://github.com/expressjs/session)
* [Moment](http://momentjs.com/)
* [Mongoose](https://github.com/Automattic/mongoose)
* [Passport](https://github.com/jaredhanson/passport)
* [Passport-facebook](https://github.com/jaredhanson/passport-facebook)
* [Passport-local](https://github.com/jaredhanson/passport-local)
* [Passport-twitter](https://github.com/jaredhanson/passport-twitter)
* [Redis](https://github.com/antirez/redis)
* [Socket.io](https://github.com/socketio/socket.io)
* [Socket.io-redis](https://github.com/socketio/socket.io-redis)
* [Winston]
