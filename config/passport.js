/*!
 * Module dependencies.
 */
var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy;
var QQStrategy= require('passport-qq').Strategy;
var WeiboStrategy = require('passport-weibo').Strategy;
var Users = mongoose.model('User');
var Providers = mongoose.model('Auth');


/*Check whether current user who login through external provider is registered already, 
   return user if already connected, else return null*/
var isConnectedProvider = function(provider_id, provider,callback) {
   var q = Providers.findOne({provider_id:provider_id,provider:provider});
   q.exec(function(err, providerUser){
     if (err) throw err;
     if (providerUser.user) { // already connected
       Users.findOne({email:providerUser.user},function(err,user){
        if (err) throw err;
        callback(user);
       }); 
     } else { //not linked yet
        callback(null);
     }
   })
} 


/*Connect user with a provider*/
var connectProvider = function(user,provider,provider_id,callback) {

}
/*Disconnect user with a provider*/
var disconnectProvider = function(user,provider,provider_id,callback) {

}


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
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
   	 	},
    	function(email, password, done) {
    			Users.isValidUserPassword(email, password, done);
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
      console.log("QQ User login:" + profile.nickname);
      Providers.findOne({provider:"QQ",provider_id:profile.id},function(err, providerUser){
         if (err) throw err;
         
         var data = {provider:"QQ",provider_id:profile.id,accessToken:accessToken,refreshToken:refreshToken,profile:profile};
         
         if (!providerUser) { 
            // if first time using provider login, create a provider user
            Providers.create(data,function(err,u){
              done(err, false, {provider:"QQ",provider_id:profile.id});
            });
          } else if (providerUser.user){ 
            // if this providerUser is linked with local user already, then update the accesstoken and return the localuser
            providerUser.update(data,function(err,u){
              Users.findOne({_id:providerUser.user},function(err, user){
                done(err,user);
              })
            });
          } else {
            // else update the provider user
            providerUser.update(data,function(err,u){
               done(err, false, {provider:"QQ",provider_id:profile.id});
            });
          }
        })
	  }
	));
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		Users.findOne({ _id: id }, function (err, user) {
      
			done(err, user);
		});
	});
	
}
