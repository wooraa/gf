// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var favicon = require('serve-favicon');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var expressHbs = require('express-handlebars');

var path = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var MongoStore	=	require('connect-mongo')(session);
// var routes = require('./routes/index');

var app      = express();
// // load our routes and pass in our app and fully configured passport
// var routes = require('./routes/index.js')(app, passport);
// var userRoutes = require('./routes/user.js')(app, passport);

//uncomment below to enable DB
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// mongoose.connect('mongodb://127.0.0.1/graFund');

require('./config/passport')(passport); // pass passport for configuration


app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// set up our express application

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
	app.use(bodyParser.urlencoded({ extended: true }));


// required for passport
app.use(session({
 secret: 'hjdcbuejuycyyiubniutb8wt8bt38t',
 resave: false,
 saveUninitialized: false,
 store: new MongoStore({ mongooseConnection: mongoose.connection }),
 cookie: { maxAge: 180 * 60 * 1000 }
})); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


//app.use(express.static('public'))
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(path.join(__dirname, '/views')));

// // sectioned routes for user related and basic index
// app.use('/user', userRoutes);
// app.use('/', routes);

app.use(function(req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});

// routes ======================================================================
require('./routes/user.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Grafund pays out within 72hrs, no jokes. Oppening on port ' + port);

// ============== COMMENTS ======================================

// // for styling header by login state =====================
// app.use(function(req, res, next) {
// 	res.local.login = req.isAuthenticated();
// 	next();
// });
// {{# if login }}
//     <li><a href="logout">Logout</a></li>
// {{ else }}
//     <li><a href="/sign-in-up">Signup or Signin</a></li>
// {{/if}
// // =======================================================




// ==========================
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs'); // set up ejs for templating
// ==========
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');
//app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
//app.set('view engine', '.hbs');

/*

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
 

*/