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

// Imports the models
var Persona = require('./models/Persona.js');
var Consumicion = require('./models/Consumicion.js');
var Gasto = require('./models/Gasto.js');
var Ingreso = require('./models/Ingreso.js');
var Pago = require('./models/Pago.js');

// Config file for the database Access
var configDB = require('./config/database.js');

if(port == 80){
  mongoose.connect(configDB.url);
}else{
  mongoose.connect(configDB.urlDev);
}


//require('./config/passport.js')(passport); // pass passport for configuration

passport.serializeUser(function(persona, done) {
  done(null, persona.id);
});

passport.deserializeUser(function(id, done) {
  Persona.findById(id, function(err, persona) {
    done(err, persona);
  });
});

// Function for log in with passportjs
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

// use morgan to log 
app.use(morgan('dev'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

// If there is a logged user, get it into the cookie
app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

app.use(session({ secret: 'estonoestansecreto'}));
app.use(passport.initialize());
app.use(passport.session());

// Function to know if there a user authenticated or not
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
	next();
  }else{
	res.send(401).json({error: 'Not authenticated user'}); 
  } 
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
  res.send('/api/login');
});

app.post('/api/pago', ensureAuthenticated, function(req, res, next){
  var pago = new Pago({
    _creador : req.user._id,
    cantidad : req.body.cantidad
  });
  pago.save(function(err){
    if(err) next(err);
    res.send(200);
  });
});

app.get('/api/pago', function(req, res, next){
	var date = new Date;
    date.setHours(0, 0, 0, 0)
    /*var endDate = new Date(date);
    endDate.setHours(23, 59, 59, 59)*/
	Pago.find({fecha: {$gte: date}}, function(err, data){
		if(data.length > 0){
			res.send(true);
		}else{
			res.send(false);
		}
		
	})
})

function calculateBote(cb){
  var gastosTotal = 0;
  var ingresosTotal = 0;
  var pagosTotal = 0;
    Gasto.find(function(err, gastos){
      gastos.forEach(function(gasto){
        gastosTotal += gasto.total;
      });
      Ingreso.find(function(err, ingresos){
        ingresos.forEach(function(ingreso){
          ingresosTotal += ingreso.cantidad;
        });
		  Pago.find(function(err, pagos){
			pagos.forEach(function(pago){
			  pagosTotal += pago.cantidad;
			});
			var bote = {
			  bote : ingresosTotal - gastosTotal,
			  boteReal : ingresosTotal - pagosTotal
			};
			cb(null, bote);
		  });
		});
    });
}
app.get('/api/bote', function(req, res, next){
  calculateBote(function(err, bote){
    res.send(bote);
  });
});

app.post('/api/consumicion', ensureAuthenticated, function(req, res, next){
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
  });
});
// Return all the 'Personas' with all the 'Gastos' and all the 'Ingresos'
app.get('/api/personas', function(req, res, next){
	Persona.find()// Find all the Personas
	.populate("gastos") // Populate Persona.gastos
	.populate("ingresos") // Populate Persona.ingresos
	.deepPopulate(["gastos.consumicion", "gastos.consumicion2"]) // Populate Persona.gastos.consumicion & Persona.gastos.consumicion2
	.exec(function(err, personas){
		res.send(personas);
	});
});

app.post('/api/gasto', ensureAuthenticated, function(req, res ,next){
  var consu;
  if(req.body.Consumicion2){
    consu = req.body.Consumicion2._id;
  }else {
     consu = null;
  }
  var gasto = new Gasto({
    _creador : req.user._id,
    consumicion: req.body.Consumicion._id,
    consumicion2: consu
  });
  gasto.save(function(err){
    if (err) return next(err);
    res.send(200);
  });
});

app.delete('/api/gasto/:id', ensureAuthenticated, function(req, res, next){
  console.log(req.params.id);
  Gasto.findOne({_id : req.params.id}, function(err, gasto){
    Persona.findById(req.user._id, function(err, persona){
    persona.gastos.pull(req.params.id);
    persona.nBajadas -= 1;
    persona.balance += gasto.total;
    persona.save();
    Gasto.remove({'_id' : req.params.id}, function(err){
    if(err){
      res.status(500);
      res.send(err);
    }
    res.sendfile('./public/index.html');
  });
  });
  });
});

app.get('/api/gastoHoy/:ID', function(req, res, next){
  Persona.findOne({_id: req.params.ID}, function(err, persona){
    if(err){
      res.next(err);
    }
    Gasto.findOne({_id: persona.gastos[persona.gastos.length - 1]}).populate("consumicion").populate("consumicion2").exec(function(err, result){
      if(err){
          res.next(err);
      }
      if(result){
        if(sameDate(result.fecha)){
          res.send(result);
        }else{
          res.send(null);
        }
      }else{
        res.send();  
      }
      
    });
  });
});

app.put('/api/gasto/:idGasto', function(req, res, next){
  console.log(req.params.idGasto);
  Gasto.findOne({_id : req.params.idGasto}, function(err, gastoViejo){
    if (err) next(err);
    if(typeof req.body.Consumicion == 'undefined'){
       gastoViejo.consumicion = null;
    }else{
      gastoViejo.consumicion = req.body.Consumicion._id;
    }
    if(typeof req.body.Consumicion2 == 'undefined'){
      gastoViejo.consumicion2 = null; 
      
    }else{
      gastoViejo.consumicion2 = req.body.Consumicion2._id;
    }
    restoreBalance(gastoViejo, function(err){
      if(err) res.send(err);
      gastoViejo.save(function(err){
        if(err) next(err);
       res.send();  
      });
    });
  });
});

function restoreBalance(gastoNuevo, cb){
  Persona.findOne({_id: gastoNuevo._creador}, function(err, creador){
    creador.balance += gastoNuevo.total;
    creador.save(function(err){
      if(err)cb(err);
    });
    cb(null);
  });
  
}

function sameDate(compareDate){
	var today = new Date();
	var dateToCompare  = new Date(compareDate);
	var result = false;
	if(+today.getDate() === +dateToCompare.getDate()){
		if(+today.getMonth() === +dateToCompare.getMonth()){
			if(+today.getFullYear() === +dateToCompare.getFullYear()){
				result = true;
			}
		}
	}	
	return result;
}

app.post('/api/ingreso', ensureAuthenticated, function(req, res ,next){
  var ingreso = new Ingreso({
    _creador : req.user._id,
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

app.listen(port, function(){
  console.log('Listening to port: ' + port);
});
module.exports = app;