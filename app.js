var express = require('express');
var hbs = require('express-hbs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfig = require('./db');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.url, function(err) {
    if (err) {
      console.log(err);
    }
});


var passport = require('passport');
var expressSession = require('express-session');
var app = express();
app.locals.PROD_MODE = 'production' === app.get('env');


app.engine('hbs', hbs.express4({
  partialsDir: __dirname+'/views/partials',
  layoutsDir: __dirname+'/views/layout'
}));


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
var flash = require('connect-flash');
app.use(flash());


var initPassport = require('./passport/init');
initPassport(passport);
//app.use(bodyParser.urlencoded());
app.use(cookieParser('storingsecretkeyincodeisnotagoodidea'));


const MongoStore = require('connect-mongo')(expressSession);

app.use(expressSession({
    secret: 'storingsecretkeyincodeisnotagoodidea',
    saveUninitialized: false, // don't create session until something stored
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection,ttl: 1 * 24 * 60 * 60 ,  touchAfter: 24 * 3600})
}));


//app.use(expressSession({ secret: 'mysecret', domain:'codelilt.com', name:'user', cookie: {maxAge: 60000000}}));



/*app.all('*', function (req, res, next) {
  console.log(req.session);
  console.log(req.sessionID);
  next(); // pass control to the next handler
});*/


app.use(passport.initialize());
app.use(passport.session());


var routes = require('./routes/index');
var passportroutes = require('./routes/passportroutes')(passport);

app.use('/', routes);
app.use('/', passportroutes);


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
