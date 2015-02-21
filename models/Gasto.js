var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;


//Gasto: {|Persona|, Fecha, |Cosumicion|}


var gastoSchema = new mongoose.Schema({
	persona: { type: Schema.ObjectId, ref: 'Persona' },
	fecha: { type: Date, default: Date.now },
	Consumicion { type: Schema.ObjectId, ref: 'Consumicion'}
});

module.exports = mongoose.model('Gasto', gastoSchema);