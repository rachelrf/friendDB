'use strict';

var controller = require('../controllers');
var helpers = require('../helpers');

module.exports = function(app, express, passport) {
	// ROUTE FOR DISPLAYING DASHBOARD
	app.get('/api/users/:user_id/clients', function (req,res) {
		controller.dashboard.get(req,res);
	});


/* =============== LOGIN & AUTHENTICATION ================ */
	// THIS ROUTE WILL REDIRECT THE USER TO GOOGLE'S LOGIN PAGE
	app.get('/login', passport.authenticate('google', 
		{ scope: ['https://www.googleapis.com/auth/userinfo.profile']}),
		function (req, res){});

	// AFTER SUBMITTING THEIR CREDENTIALS, GOOGLE WILL REDIRECT THE USER TO '/login-verify'. IF THE LOGIN
	// WAS SUCCESSFUL, THE USER WILL THEN BE REDIRECTED TO THE URL SPECIFIED BY 'successRedirect'. IF NOT, THEY
	// WILL BE REDIRECTED TO THE URL SPECIFIED BY 'failureRedirect'.
	app.get('/login-verify', passport.authenticate('google', 
		{
			successRedirect: 'http://localhost:3000/home',
			failureRedirect: '/'
		}));

	// THIS IS JUNK I CONJURED UP FOR THE SAKE OF FIXING THE ERROR
	app.get('/api/loginfo', function (req, res) {
		console.log(req.session.passport.user);
		res.redirect('/home');
	})

/* =============== FRIEND ROUTES ========================= */
	// ROUTE FOR CREATING A NEW FRIEND
	app.post('/api/users/:friend_id/clients', function (req,res) {
		 controller.friend.post(res, req.body, req.params.friend_id);
	});

	// ROUTE FOR DISPLAYING PARTICULAR FRIEND
	app.get('/api/users/:user_id/clients/:friend_id', function (req,res) {
		controller.friend.get(res, req.params.friend_id, req.params.user_id);
	});

	// ROUTE FOR UPDATING A PARTICULAR FRIENDS'S INFORMATION
	app.put('/api/users/:user_id/clients/:friend_id', function (req, res) {
		controller.friend.put(res, req.body, req.params.friend_id, req.params.user_id);
	});


/* ================ USER ROUTES ================= */
	// ROUTE FOR CREATING A NEW USER
	app.post('/api/createUser', function (req, res) {
		controller.user.post(res, req.body.arr);
	});

	app.get('/api/createUser/:id', function (req, res) {
		controller.user.getById(res, req.params.id);
	});

  // ROUTE FOR UPDATING A CLIENT
	//app.put('/api/users/:user_id/clients/:client_id', controller.client.put);

	// ROUTE FOR GETTING FEED FOR A PARTICULAR CLIENT
	app.get('/api/users/:user_id/clients/:client_id/feed', function(req,res){
		// SOMEHOW GET THE CLIENT RECORD FROM CLIENT DATABASE
		// LOOK AT THE COLUMNS IN THE CLIENT RECORD, CREATE A PARAMS OBJECT BASED ON THAT
		// SEND THAT TO CONTROLLER.FEED.GET
		// PARAMS OBJ: {'client_company':'Togos', 'client_zipcode':'94303'}
		controller.feed.getOneFriend(req,res, controller.feed.getFeed);
	});

	app.get('/api/users/:user_id/clients/:client_id/gifts', function(req, res) {
		controller.feed.getOneFriend(req, res, controller.feed.getGifts);
	});
	
/* ============= AUTHENTICAITON HELPER ============= */
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login');
	}
};

