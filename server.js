var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var bcrypt = require('bcryptjs');
var Persona = require('./models/Persona.js');
var Consumicion = require('./models/Consumicion.js');
var Gasto = require('./models/Gasto.js');
var Ingreso = require('./models/Ingreso.js');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

//require('./config/passport.js')(passport); // pass passport for configuration

passport.serializeUser(function(persona, done) {
  done(null, persona.id);
});

passport.deserializeUser(function(id, done) {
  Persona.findById(id, function(err, persona) {
    done(err, persona);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  Persona.findOne({ email: email }, function(err, persona) {
    if (err) return done(err);
    if (!persona) return done(null, false);
    persona.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, persona);
      return done(null, false);
    });
  });
}));

app.use(morgan('dev'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

app.use(session({ secret: 'estonoestansecreto'}));
app.use(passport.initialize());
app.use(passport.session());


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}

app.get('/', function(req, res){
	res.sendfile('./public/index.html');
});

app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});

app.post('/api/signup', function(req, res, next) {
  var persona = new Persona({
    email: req.body.email,
    password: req.body.password,
    nombre: req.body.nombre,
    balance: 0,
    nBajadas: 0,
    NPagado: 0
  });
  persona.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.get('/api/logout', function(req, res, next) {
  req.logout();
  res.send(200);
});

app.post('/api/consumicion', ensureAuthenticated, function(req, res ,next){
	var consumicion = new Consumicion({
		nombre : req.body.nombre,
		tipo : req.body.tipo,
		precio : req.body.precio
	});
	consumicion.save(function(err){
		if (err) return next(err);
		res.send(200);
	});
});

app.get('/api/consumicion/:tipo', ensureAuthenticated, function(req, res, next){
  Consumicion.find({tipo: req.params.tipo}, function(err, result){
    if(err) res.send(err);
    res.send(result);
  })
});

app.post('/api/gasto', ensureAuthenticated, function(req, res ,next){
  var gasto = new Gasto({
    persona : req.user._id,
    consumicion: req.body.Consumicion._id
  });
  gasto.save(function(err){
    if (err) return next(err);
    res.send(200);
  });
});

app.post('/api/ingreso', ensureAuthenticated, function(req, res ,next){
  var ingreso = new Ingreso({
    persona : req.user._id,
    cantidad : req.body.Cantidad
  });
  ingreso.save(function(err){
    if (err) return next(err);
    res.send(200);
  });
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(port);
