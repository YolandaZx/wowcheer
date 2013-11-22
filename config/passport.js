/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy;

var localUserSchema = new mongoose.Schema({
	email: String,
	salt: String,
	hash: String
});
var Users = mongoose.model('userauths', localUserSchema);


module.exports = function (passport, config) {
	var provider = config.provider;
	// Local strategy
	passport.use(new LocalStrategy(function(email, password,done){
		Users.findOne({ email : email},function(err,user){
			if(err) { return done(err); }
			if(!user){
				return done(null, false, { message: 'Incorrect email.' });
			}

			hash( password, user.salt, function (err, hash) {
				if (err) { return done(err); }
				if (hash == user.hash) return done(null, user);
				done(null, false, { message: 'Incorrect password.' });
			});
		});
	}));
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		Users.findById(id, function(err,user){
			if(err) done(err);
			done(null,user);
		});
	});
}
