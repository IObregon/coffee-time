var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var Persona = require('./Persona.js');


//Ingreso: {|Persona|, Cantidad, Fecha}

var pagoSchema = new Schema({
	_creador : { type: Schema.ObjectId, ref: 'Persona' },
	fecha: { type: Date, default: Date.now },
	cantidad: Number
});

pagoSchema.post('save', function(next){
	var pago = this;
	Persona.findById(this._creador, function(err, persona){
		persona.pagos.push(pago);
		persona.NPagado += 1;
		persona.save();
	});
});

module.exports = mongoose.model('Pago', pagoSchema);
