var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;


//Gasto: {|Persona|, Fecha, |Cosumicion|}


var gastoSchema = new Schema({
	persona: { type: Schema.ObjectId, ref: 'Persona' },
	fecha: { type: Date, default: Date.now },
	consumicion: { type: Schema.ObjectId, ref: 'Consumicion'},
	consumicion2: { type: Schema.ObjectId, ref: 'Consumicion'}
});

module.exports = mongoose.model('Gasto', gastoSchema);