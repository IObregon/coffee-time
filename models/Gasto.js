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
	Consumicion.findOne({_id : gasto.consumicion}, function(err, consumicion){
		gasto.total += consumicion.precio
	});
	if(gasto.consumicion2){
		Consumicion.findOne({_id : gasto.consumicion2}, function(err, consumicion2){
			gasto.total += consumicion2.precio
			next();	
		});
	}


})

gastoSchema.post('save', function(next){
	var gasto = this;
	Persona.findById(this._creador, function(err, persona){
		persona.gastos.push(gasto);
		persona.balance -= gasto.total;
		console.log(persona.balance)
		persona.save();
	});
});

module.exports = mongoose.model('Gasto', gastoSchema);