var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var Persona = require('./Persona.js');
var Consumicion = require('./Consumicion.js');


//Gasto: {|Persona|, Fecha, |Cosumicion|}


var gastoSchema = new Schema({
	_creador : { type: Schema.ObjectId, ref: 'Persona' },
	fecha: { type: Date, default: Date.now },
	consumicion: { type: Schema.ObjectId, ref: 'Consumicion'},
	consumicion2: { type: Schema.ObjectId, ref: 'Consumicion'},
	total: { type: Number, default: 0}
});

gastoSchema.pre('save', function(next){
	var gasto = this;
	updateGastoTotal(gasto, function(err, gasto){
		if(err) next(err);
		next();
	});
});

gastoSchema.post('save', function(next){
	var gasto = this;
	Persona.findById(this._creador, function(err, persona){
		if(persona.gastos.indexOf(gasto._id) == -1){
			persona.gastos.push(gasto);
			persona.nBajadas += 1;
		}
		persona.balance -= gasto.total;
		persona.save();
	});
});

gastoSchema.pre('update', function(next){
	var gasto = this;
	updateGastoTotal(gasto, function(err, gasto){
		if(err) next(err);
		next();
	});
});




var updateGastoTotal = function(gasto, cb){
	var Consumiciones = [];
	Consumiciones.push(gasto.consumicion); 
	Consumiciones.push(gasto.consumicion2);
	Consumicion.find().where('_id').in(Consumiciones).exec(function(err, consumiciones){
		if(err) cb(err);
		var total = 0;
		consumiciones.forEach(function(consumicion){
			total += consumicion.precio;
		});
		gasto.total = total;
		cb(null, gasto);
	});
};

module.exports = mongoose.model('Gasto', gastoSchema);