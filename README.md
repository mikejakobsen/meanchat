
![alt tag](http://www.mikejakobsen.com/mike.png)

# Project Nearly Mean Stack Chat

## To do

```
- [x] npm install && bower install
- [ ] Production: Gulp watch
- [ ] For viewing pleasue only: nodemon
- [ ] http://localhost:3000
```

Excersise description http://www.mikejakobsen.com/stuff/mandatory-1.pdf

## File Structure

```
.
├── README.md
├── app
│   ├── auth
│   │   └── index.js
│   ├── config
│   │   ├── config.json
│   │   └── index.js
│   ├── database
│   │   ├── index.js
│   │   └── schemas
│   │       ├── message.js
│   │       ├── room.js
│   │       └── user.js
│   ├── logger
│   │   └── index.js
│   ├── models
│   │   ├── message.js
│   │   ├── room.js
│   │   └── user.js
│   ├── routes
│   │   └── index.js
│   ├── session
│   │   └── index.js
│   ├── socket
│   │   └── index.js
│   └── views
│       ├── chatroom.ejs
│       ├── head.ejs
│       ├── login.ejs
│       └── rooms.ejs
├── bower.json
├── debug.log
├── docs
│   └── README.md
├── gulpfile.js
├── package.json
├── server.js
├── src
│   ├── img
│   │   └── user.jpg
│   ├── js
│   │   ├── login.js
│   │   ├── main.js
│   │   └── rooms.js
│   └── styles
│       ├── app.sass
│       └── variables.sass
├── static
│   ├── css
│   │   └── app.css
│   ├── img
│   │   ├── user.jpg
│   │   └── user.png
│   └── js
│       ├── login.js
│       ├── main.js
│       └── rooms.js
└── structure.md

20 directories, 38 files
```

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

For at konventere tidsangivelserne i chatten fra SI tidsangivelse, til relativ tidsangivelse benyttes [Moment.js](http://momentjs.com/docs/). Indledningsvis importeres Moment.js i [node-serveren](https://github.com/mikejakobsen/meanchat/blob/Date-fix/server.js#L10).

```javascript
var moment = require('moment');
moment().format();
```

Moment.js laver en wrapper omkring `Date` object. For at tilgå denne wrapper kaldes `moment()` med en dato som parameter.
For at ændre tidsangivelserne i beskederne, kaldes `moment(message.date)` derfor, samt [fromNow()](https://github.com/moment/momentjs.com/blob/b1e718bc2cff461db34214992c79ba4054fa5d33/docs/moment/04-displaying/02-fromnow.md). Som en del af en EJS template string, ser det således ud.

```javascript
<%= moment(message.date).fromNow() %>
```
[EjS og Moment.js](https://github.com/mikejakobsen/meanchat/blob/Date-fix/app/views/chatroom.ejs#L49)


## Mongoose

Mongoose er en (ODM) `object data modeling`, der gør det muligt at fastsætte en [datamodel](https://github.com/mikejakobsen/meanchat/tree/Date-fix/app/database/schemas), og dermed en struktur i den gemte data. 

Kontra en `ORM` som fx. [Laravel Elequent](https://laravel.com/docs/master/eloquent). Der `mapper` SQL-syntaxen så PHP kan interagere med SQL. Behøver en `ODM` som Mongoose ikke redefinere forholdet imellem database og applicationen, da `JSON` og `BSON` interager gnindningsfrit. 


## EJS

EJS benyttes som `template engine`. En template engine gør det muligt at benytte statiske filer som `html`, da template enginen tilføjer eventuel dynamisk indhold ved runtime, og sender disse til clienten. Express understøtter en række [template engines](https://github.com/expressjs/express/wiki#template-engines). For at bibeholde den grundlæggende `html` struktur benyttes [EJS](http://www.embeddedjs.com/getting_started.html), der som navnet antyder `Èmbedded JavaScript`, tillader fx at frekventere et `ForLoop`, der tillader applicationen  at iterere over de gemte beskeder for dernæst at printe de [sendte beskeder](https://github.com/mikejakobsen/meanchat/blob/Date-fix/app/views/chatroom.ejs#L45).

```ejs
<% room.messages.forEach(function(message) { %>
	<div class="message-data">
		<span class="message-data-name"><%= message.username %></span>
		<span class="message-data-time"><%= message.date %></span>
	</div>
	<div class="message my-message" dir="auto"><%= message.content %></div>
<% }); %>
```

I forhold til de `runtime` sendte beskeder fra [Socket.io](https://github.com/socketio/socket.io), printes disse via JavaScript. Da EJS ikke tillader at tilføje elementer til applications DOM [løbende](https://github.com/mikejakobsen/meanchat/blob/Date-fix/src/js/main.js#L146). Disse beskeder appendes dernæst til [.chat history ul](https://github.com/mikejakobsen/meanchat/blob/Date-fix/app/views/chatroom.ejs#L43). Med hjælp fra Jquery.

```javascript
addMessage: function(message, users){
	message.date      = (new Date(message.date)).toLocaleString();
	message.username  = this.encodeHTML(message.username);
	message.content   = this.encodeHTML(message.content);


	var html = `<li class="clearfix">
		<div class="message-data align-right">
		<span class="message-data-time" >${message.date}</span> &nbsp; &nbsp;
	<span class="message-data-name" >${message.username}</span>
		</div>
		<div class="message other-message float-right">
		${message.content}
	</div>
		</li>`;
}

$(html).hide().appendTo('.chat-history ul').slideDown(200);

}
```


## Dependencies


### Brugte moduler

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
