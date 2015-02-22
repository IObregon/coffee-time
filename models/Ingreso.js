var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;


//Ingreso: {|Persona|, Cantidad, Fecha}

var ingresoSchema = new Schema({
	persona: { type: Schema.ObjectId, ref: 'Persona' },
	fecha: { type: Date, default: Date.now },
	cantidad: Number
});