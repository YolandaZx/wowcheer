/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy;
var QQStrategy= require('passport-qq').Strategy;
var WeiboStrategy = require('passport-weibo').Strategy;

var localUserSchema = new mongoose.Schema({
	email: String,
	salt: String,
	hash: String
});

var Users = mongoose.model('userauths', localUserSchema);

var compilePath = function(provider, callbackPath) {
	var patt=/:provider/g;
	patt.compile(patt); 
	str2=callbackPath.replace(patt,provider);	
	return str2;
}

module.exports = function (app,passport, config) {
	var provider = config.provider;
	var env = app.get('env');
	var callback = provider.callback[env];
	
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
	
	// Weibo strategy
	var weiboCallback = compilePath("weibo",callback);
	// Store the compiled callback into configuration
	config.provider.weibo.callback = weiboCallback;
	passport.use(new WeiboStrategy({
		clientID: provider.weibo.id,
		clientSecret: provider.weibo.secret,
		callbackURL: weiboCallback
	  },
	  function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({ weiboId: profile.id }, function (err, user) {
		  return done(err, user);
		});
	  }
	));

	// QQ strategy
	var qqCallback = compilePath("qq",callback);
	config.provider.qq.callback = qqCallback;
	passport.use(new QQStrategy({
		clientID: provider.qq.id,
		clientSecret: provider.qq.secret,
		callbackURL: qqCallback
	  },
	  function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({ qqId: profile.id }, function (err, user) {
		  return done(err, user);
		});
	  }
	));
	
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
