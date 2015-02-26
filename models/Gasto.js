var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var Persona = require('./Persona.js');


//Gasto: {|Persona|, Fecha, |Cosumicion|}


var gastoSchema = new Schema({
	 _creador : { type: Schema.ObjectId, ref: 'Persona' },
	fecha: { type: Date, default: Date.now },
	consumicion: { type: Schema.ObjectId, ref: 'Consumicion'},
	consumicion2: { type: Schema.ObjectId, ref: 'Consumicion'}
});

gastoSchema.post('save', function(next){
	var gasto = this;
	Persona.findById(this._creador, function(err, persona){
		persona.gastos.push(gasto);
		persona.save();
	});
});

module.exports = mongoose.model('Gasto', gastoSchema);