var mongoose = require('mongoose');

//Consumicion: {Nombre, Tipo, Precio}

var consumicionSchema = new mongoose.Schema({
	nombre: {type:String, unique: true},
	tipo: String,
	precio: Number
});

module.exports = mongoose.model('Consumicion', consumicionSchema);