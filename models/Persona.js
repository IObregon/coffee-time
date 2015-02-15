var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Personas: {Nombre, Balance, NBajada, NPagado}
var personaSchema = new mongoose.Schema({
	email: {type:String, unique: true},
	password: String,
	nombre: String,
	balance: Number,
	nBajadas: Number,
	NPagado: Number
});

personaSchema.pre('save', function(next){
	var persona = this;
	if(!persona.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt){
		if (err) return next(err);
		bcrypt.hash(persona.password, salt, function(err, hash){
			if(err) return next(err);
			persona.password = hash;
			next();
		});
	});
});

personaSchema.methods.comparePassword = function(candidatePassword, cb){
	var correctPassword = this.password;
	bcrypt.compare(candidatePassword, correctPassword, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Persona', personaSchema);