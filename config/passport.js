/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var localUserSchema = new mongoose.Schema({
username: String,
salt: String,
hash: String
});
var Users = mongoose.model('userauths', localUserSchema);

var FacebookUserSchema = new mongoose.Schema({
    fbId: String,
    email: { type : String , lowercase : true},
    name : String
});
var FbUsers = mongoose.model('fbs',FacebookUserSchema);
/**
 * Expose
 */

module.exports = function (passport, config) {
	var provider = config.provider;
	// Local strategy
	passport.use(new LocalStrategy(function(username, password,done){
		Users.findOne({ username : username},function(err,user){
			if(err) { return done(err); }
			if(!user){
				return done(null, false, { message: 'Incorrect username.' });
			}

			hash( password, user.salt, function (err, hash) {
				if (err) { return done(err); }
				if (hash == user.hash) return done(null, user);
				done(null, false, { message: 'Incorrect password.' });
			});
		});
	}));
	
	// Facebook strategy
	passport.use(new FacebookStrategy({
		clientID: provider.facebook.id,
		clientSecret: provider.facebook.secret,
		callbackURL: "http://localhost:3000/auth/facebook/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
		FbUsers.findOne({fbId : profile.id}, function(err, oldUser){
			if(oldUser){
				done(null,oldUser);
			}else{
				var newUser = new FbUsers({
					fbId : profile.id ,
					email : profile.emails[0].value,
					name : profile.displayName
				}).save(function(err,newUser){
					if(err) throw err;
					done(null, newUser);
				});
			}
		});
	  }
	));
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// TODO: add more auth
	passport.deserializeUser(function(id, done) {
		FbUsers.findById(id,function(err,user){
			if(err) done(err);
			if(user){
				done(null,user);
			}else{
				Users.findById(id, function(err,user){
					if(err) done(err);
					done(null,user);
				});
			}
		});
	});
}
