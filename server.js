var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var bcrypt = require('bcryptjs');

var configDB = require('./config/database.js');

mongoose.connect(configdb.url);

// require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));

app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'estonoestansecreto'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
