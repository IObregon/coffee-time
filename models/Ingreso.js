var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var Persona = require('./Persona.js');


//Ingreso: {|Persona|, Cantidad, Fecha}

var ingresoSchema = new Schema({
	_creador : { type: Schema.ObjectId, ref: 'Persona' },
	fecha: { type: Date, default: Date.now },
	cantidad: Number
});

ingresoSchema.post('save', function(next){
	var ingreso = this;
	Persona.findById(this._creador, function(err, persona){
		persona.ingresos.push(ingreso);
		persona.save();
	});
});

module.exports = mongoose.model('Ingreso', ingresoSchema);