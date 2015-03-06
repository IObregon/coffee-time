var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var Persona = require('./Persona.js');
var Consumicion = require('./Consumicion.js')


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
	/*Consumicion.findOne({_id : gasto.consumicion}, function(err, consumicion){
		gasto.total += consumicion.precio
	});
	if(gasto.consumicion2){
		Consumicion.findOne({_id : gasto.consumicion2}, function(err, consumicion2){
			gasto.total += consumicion2.precio
		});
	}
	next();*/
	updateGastoTotal(gasto, function(err, gasto){
		console.log("dentro del cb de al funcio" + gasto.total);
		if(err) next(err);
		next();
	})
})

gastoSchema.post('save', function(next){
	var gasto = this;
	Persona.findById(this._creador, function(err, persona){
		persona.gastos.push(gasto);
		persona.balance -= gasto.total;
		console.log(persona.balance)
		persona.save();
		console.log("Gasto despues de guardar. " + gasto.total);
	});
});

gastoSchema.pre('update', function(next){
	var gasto = this;
	console.log("Gasto que llega" + gasto);
	this.db.model('Gasto').findById(gasto._id, function(err, gastoViejo){
		updateGastoTotal(gasto, function(err, gasto){
			if(err) next(err);
			var diferencia = 0;
			diferencia = gastoViejo.total - gasto.total;
			Persona.findById(gastoViejo._creador, function(err, persona){
				console.log("diferencia: " + diferencia)
				persona.balance += diferencia;
				console.log(persona.balance)
				persona.save();
			});
		console.log("Gasto antes de terminar es : " + gasto);
		next();
		})
	})
	console.log("Soy this" + this);
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
		console.log("El total dentro de la funcion es : " + gasto.total)
		cb(null, gasto)
	});
}

module.exports = mongoose.model('Gasto', gastoSchema);