var express = require('express');
// var router	= express.router();
var Plan = require('../app/models/plan');
var User		= require('../app/models/user');
var Choice 		= require('../app/models/choice');
var Order 	= require('../app/models/order');
var Account = require('../app/models/account');
var Confirm = require('../app/models/confirm');
var Help = require('../app/models/help');
//var csrf		= require('Csurf');

//var csrfProtection = csrf();

module.exports = function(app, passport) {


// // API End point

// // on routes that end in /user/:user_id
// // ----------------------------------------------------
// // router.route('/users/:user_id')

//     // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
//     app.get(function(req, res) {
//         ...
//     })

//     // update the user with this id (accessed at PUT http://localhost:8080/user/user/:user_id)
//     app.put('/user/account-form', function(req, res) {

//         // use our bear model to find the bear we want
//         User.findById(req.params.user_id, function(err, user) {

//             if (err)
//                 res.send(err);

//             user.name = req.body.name;  // update the users info

//             // save the user
//             user.save(function(err) {
//                 if (err)
//                     res.send(err);

//                 res.json({ message: 'user updated!' });
//             });

//         });
//     });

// // API End points

	// =============================================================================
	// AUTHENTICATED (Routes that are authenticated(user should be signed in for routes to be accessible)) ===
	// =============================================================================

	//	SAVING USER ACCOUNT DETAILS
		app.post('/user/account-form', function(req, res, next) {
			var	user	= req.user;
			var bank_name  = req.body.bankName;
			var account_name = req.body.accountName;
			var account_number = req.body.accountNumber;
			var phone_number = req.body.phoneNumber;
		//  var account_email = req.body.account_email;
			var user_name = req.body.userName;
			var referrer = req.body.referrer;
		
			var account = new Account();
			account.user = req.user;
			account.details.bank_name  = bank_name;
			account.details.account_name = account_name;
			account.details.account_number = account_number;
			account.details.phone_number = phone_number;
		//  account.details.account_email = account_email;
			account.details.user_name = user_name;
			account.details.referrer = referrer;
			account.save(function(err, savedAccount) {
				if(err) {
					console.log(err);
				} else {
				console.log('User account details successfully added');
			    req.flash('success', "Welcome, please go to the plans page and choose a plan.")
				res.redirect('/user/space');
				}
			});
			});

		// INITIALISE THE ADDITIONAL FORM FIELD
		app.get('/user/account-form', isLoggedIn, function(req, res, next) {
			res.render('user/account-form', {
				user : req.user
			});
		});

		// INITIAL P2P REGISTRATION SECTION =========================
		app.get('/p2p', isLoggedIn, function(req, res) {
			res.render('user/p2p.hbs');
		});

		// space SECTION =========================
		// app.get('/user/space', isLoggedIn, function(req, res) {
		// 	res.render('user/space', {
		// 		user : req.user, account : req.user.account
		// 	});
		// });

		app.get('/user/space', isLoggedIn, function (req, res, next) {
			var account = Account({user: req.user});
			Account.findOne({user: req.user}, function(err, account) {
				if (err) {
					res.send(500);
					return;
				}
				console.log(account)
				res.render('user/space', {user: req.user, account: account, message: req.flash('success') });
			});
		});

	// =============================================================================
	// ( WIP) )===================================
	// This should be re-routed to the p2p-choose route
	// =============================================================================
		// route to page for testing purposes ( remember to take this out)============
		// show the home page (will also have our login links)
		app.get('/plans', isLoggedIn, function(req, res, next) {
			Plan.find(function(err, docs) {
				var planChunks = [];
				var chunkSize = 2;
				for (var i = 0; i < docs.length; i += chunkSize) {
					planChunks.push(docs.slice(i, i + chunkSize));
				}
				res.render('user/plans', {user : req.user, title: 'Testing Purposes Only', plans: planChunks });
		});
		});
	// ===========================================================================
	// choice COLLECTION (user's choice configuration)=================================
	// ===========================================================================
	// adding selected plan to user's list of choice(s) (plan(s))
		app.get('/add-to-choice/:id', function(req, res, next) {
			var planId = req.params.id;
			var choice = new Choice(req.session.choice ? req.session.choice : {});

			Plan.findById(planId, function(err, plan) {
				if (err) {
					return res.redirect('/user/mychoices');
				}
				choice.add(plan, plan.id);
				req.session.choice = choice;
				console.log(req.session.choice);
				res.redirect('/user/mychoices'); // redirect to plan page
			});
		});

		// Reducing by one same-type plan in selection in list of choice(s)
		app.get('/reduce/:id', isLoggedIn, function(req, res, next) {
			var planId = req.params.id;
			var choice = new Choice(req.session.choice ? req.session.choice : {});

				choice.reduceByOne(planId);
				req.session.choice = choice;
				res.redirect('/user/mychoices');
		});

	// Removing all same-type plan in selection in list of choices
		app.get('/remove/:id', function(req, res, next) {
			var planId = req.params.id;
			var choice = new Choice(req.session.choice ? req.session.choice : {});

				choice.removeItem(planId);
				req.session.choice = choice;
				res.redirect('/user/mychoices');
		});

	// === choices wallet route ====
		// app.get('/user/mychoices', isLoggedIn, function(req, res, next) {
		// 	if (!req.session.cart) {
		// 		return res.render('user/mychoices', {plans: null});
		// 	}
		// 	var choice = new Choice(req.session.choice);
		// 	res.render('user/mychoices', { user : req.user, plans: choice.generateArray(), totalPrice: choice.totalPrice});
		// });

		// app.get('/checkout', function(req, res, next) {
		// 	if (!req.session.choice) {
		// 		return res.redirect('/mychoices'});
		// 	}
		// 	var choice = new choice(req.session.choice);
		// 	res.render('mychoices', {total: choice.totalPrice});
		// });
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ |||
		// === ROUTE TO CHECKOUT (SAVE SELETED PACKAGES TO THE DB FOR FETCHING)
		app.get('/user/mychoices', isLoggedIn, function(req, res, next) {
			if (!req.session.choice) {
				return res.redirect('/user/mychoices', {plans: null});
			}
			var choice = new Choice(req.session.choice);
			res.render('user/mychoices', { plans: choice.generateArray(), totalPrice: choice.totalPrice});
		});
		// ===========||| POST REQUEST |||===========================

		app.post('/user/mychoices', isLoggedIn, function(req, res, next) {
			if (!req.session.choice) {
				return res.redirect('/plans');
			}
			var choice = new Choice(req.session.choice);
			//
			var order = new Order({
				user: req.user,
				choice: choice,

				confirm: req.body.confirm
			});
			order.save(function(err, result) {
				console.log('success', 'You Successfully Chose Plan.');
				req.session.choice = null;
				res.redirect('/user/space');
				});
		});
// ================^^^========================================================== |||


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ |||
		// === ROUTE TO Confirm Downline (Display the page with downline confirmation Button)
		app.get('/user/confirm-downline', isLoggedIn, function(req, res, next) {
			res.render('user/confirmation', { title: 'Downline Confirmation'});
		});
		// ===========||| POST REQUEST |||===========================

		app.post('/user/confirm-downline', isLoggedIn, function(req, res, next) {
			var user	= req.user;
			var confirm = req.body.confirm;
			var comment = req.body.comment;

			var confirm = new Confirm();
			confirm.user = req.user;
			confirm.confirm = confirm;
			confirm.comment = comment;
			confirm.save(function(err, savedConfirmation) {
			    if(err) {
			        console.log(err);
			    } else {
			    console.log('Downline Successfully Confirmed');
			    req.flash('success', "Downline Successfully Confirmed!. It might take a while to reflect on your downline's dashboard")
			    res.redirect('/user/space');
			    }
			});
		});
// ================^^^========================================================== |||


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ |||
		// === ROUTE TO FOR HELP PAGE, 
		app.get('/user/help', isLoggedIn, function(req, res, next) {
			res.render('user/help-me', { title: 'Help Me'});
		});
		// ===========||| POST REQUEST |||===========================

		app.post('/user/help', isLoggedIn, function(req, res, next) {
			var user	= req.user;
			var subject = req.body.subject;
			var user_name = req.body.user_name;
			var body = req.body.body;

			var help = new Help();
			help.user = req.user;
			help.content.subject = subject;
			help.content.user_name = user_name;
			help.content.body = body;
			help.save(function(err, savedContent) {
			    if(err) {
			        console.log(err);
			    } else {
			    console.log('your message was delivered.');
			    req.flash('success', "Your querry has been delivered. You will get a response on your user space.")
			    res.redirect('/user/space');
			    }
			});
		});
// ================^^^========================================================== |||


	// ===========================================================================


		app.get('/user/profile/', function (req, res, next) {
			Order.find({user: req.user}, function(err, orders) {
				if (err) {
					console.log('err');
					return res.redirect('/user/mychoices')
				}
				var choice;
				orders.forEach(function(order) {
					choice = new Choice(order.choice);
					order.items = choice.generateArray();
				});
				res.render('user/profile', { orders: orders });
			});
		});

	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	//
	//
	//
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// =============================================================================
	// UN-AUTHENTICATED (for all) ==================================================
	// =============================================================================
	// route middleware to ensure user is not logged in
		// app.use('/', notLoggedIn, function(req, res, next) {
		// 	next();
		// });


		// Thwad fornt page. Un-registered visitors can browse through to get familiar with thwad
		// show the main-page page with [how thwad works][FAQs] (will also have our login links)
		app.get('/main-page', function(req, res) {
			res.render('main-page.hbs');
		});


		// We know sometimes you don't know every thing. The FAQs Page will help with that.
		// show the project page (will also have our login links)
		app.get('/faq', function(req, res) {
			res.render('faq.hbs');
		});

		// The thwad p2p system.
		// The p2p page (will also have our login links)
		// app.get('/p2p', function(req, res) {
		// 	res.render('user/p2p.hbs');
		// });

		// The entry point into Thwad Nation. Login or Register. ( for now we'll only allow for social media authentication )
		// show the sign-in/sign-up page (will also have our login links)
		app.get('/sign-in-up', function(req, res) {
			res.render('user/sign-in-up.hbs');
		});

		// LOGOUT ==============================
		app.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});



	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

		// locally --------------------------------
			// LOGIN ===============================
			// show the login form
			app.get('/user/login', function(req, res) {
				res.render('user/login', { message: req.flash('message')});
			});

			// process the login form (successRedirect : '/profile',)
			app.post('/user/login', passport.authenticate('local-login', {
				successRedirect : '/user/space', // redirect to the secure profile section
				failureRedirect : '/user/login', // redirect back to the signup page if there is an error
				failureFlash : true // allow flash messages
			}));

			// SIGNUP =================================
			// show the signup form// csrfToken: req.csrfToken(),
			app.get('/user/signup', function(req, res) {
				res.render('user/signup', { message: req.flash('message')});
			});

			// process the signup form (successRedirect : '/profile',)
			app.post('/user/signup', passport.authenticate('local-signup', {
				successRedirect : '/user/account-form', // redirect to the secure profile section ----------- /profile ----------
				failureRedirect : '/user/signup', // redirect back to the signup page if there is an error
				failureFlash : true // allow flash messages
			}));


	// =============================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
	// =============================================================================

		// locally --------------------------------
			app.get('/connect/local', function(req, res) {
				res.render('connect-local.hbs', { message: req.flash('loginMessage') });
			});
			app.post('/connect/local', passport.authenticate('local-signup', {
				successRedirect : '/inside', // redirect to the secure profile section (successRedirect : '/profile',)
				failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
				failureFlash : true // allow flash messages
			}));


	// =============================================================================
	// UNLINK ACCOUNTS =============================================================
	// =============================================================================
	// used to unlink accounts. for social accounts, just remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future

		// local ----------------------------------- (successRedirect : '/profile',)
		app.get('/unlink/local', function(req, res) {
			var user            = req.user;
			user.local.email    = undefined;
			user.local.password = undefined;
			user.save(function(err) {
				res.redirect('/inside');
			});
		});
};// passport exports

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

// route middleware to ensure user is logged in
// function notLoggedIn(req, res, next) {
// 	if (!req.isAuthenticated())
// 		return next();
//
// 	res.redirect('/');
// }





// =============================================================================
// =============================================================================
// =============================================================================
// LOOPING BODYPARSED CONTENT TO VIEW
// =============================================================================
// =============================================================================
// =============================================================================

// === Proper rout for fetching downline and displaying to user
// ================================== NOT SO FEASIBLE NEEDS MORE WORK
	// app.get('/test2', isLoggedIn, function(req, res, next) {
	// 	User.find()
	// 		.then(function(doc) {
	// 			res.render('test2.hbs', { user : req.user, title: 'Testing Purposes Only', item: doc });
	// });
	// });

// ====================================== /test3 route page not created yet available!
	// app.get('/test3', isLoggedIn, function(req, res, next) {
	// 	User.find(function(err, docs) {
	// 		var userChunks = [];
	// 		var chunkSize = 2;
	// 		for (var i = 0; i < docs.length; i += chunkSize) {
	// 			userChunks.push(docs.slice(i, i + chunkSize));
	// 		}
	// 		res.render('test3.hbs', { user : req.user, title: 'Testing Purposes Only', users: userChunks });
	// });
	// });


// =============================================================================
// Sand Box (for testing purposes only )====================================
// =============================================================================


// === Proper rout for fetching downline and displaying to user
// ================================== NOT SO FEASIBLE NEEDS MORE WORK
	// app.get('/test2', isLoggedIn, function(req, res, next) {
	// 	User.find()
	// 		.then(function(doc) {
	// 			res.render('test2.hbs', { user : req.user, title: 'Testing Purposes Only', item: doc });
	// });
	// });
// ====================================== /test3 route page not available!
	// app.get('/test3', isLoggedIn, function(req, res, next) {
	// 	Account.find(function(err, docs) {
	// 		var accountChunks = [];
	// 		var accountSize = 2;
	// 		for (var i = 0; i < docs.length; i += chunkSize) {
	// 			accountChunks.push(docs.slice(i, i + chunkSize));
	// 		}
	// 		res.render('test3.hbs', { user : req.user, title: 'Testing Purposes Only', accounts: accountChunks });
	// });
	// });



// // normal routes ============================================================
// // route middleware to ensure user is not logged in
// 	app.use('/', notLoggedIn, function(req, res, next) {
// 		next();
// 	});
// =============================================================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++







// =============================================================================
// =============================================================================
// =============================================================================
// ON choiceS AND CHECKING OUT
// =============================================================================
// =============================================================================
// =============================================================================

	// choice CHECKOUT CONFIG
	// app.post('/checkout', function(req, res, next) {
	// 		if (!req.session.cart) {
	// 			return res.redirect('/choices'});
	// 		}, function(err, charge) {
	// 			if (err,) {
	// 				req.flash('error', err.message);
	// 				return res.redirect('/checkout');
	// 			}
	//			var order = new Order({
			// 		user: req.user,
			// 		choice: choice,
			// 		address: req.body.address,
			// 		name: req.body.name,
			// });
			// Order.save(function(err, result) {
			// 			req.flash('success', 'Successfully added your details');
			// 			req.session.choice = null;
			// 			res.redirect('/test');
			// 	});
			// });

	// app.get('/profile', isLoggedIn, function (req, res, next) {
	// 	Order.find({user: req.user}), function(err, orders) {
	// 		if (err) {
	// 			return res.write('Error');
	// 		}
	// 		var choice;
	// 		orders.forEach(function(order) {
	// 			choice = new choice(order.choice);
	// 			order.items = choice.generateArray();
	// 		});
	// 		res.render('user/profile', { orders: orders });
	// 	});
	// });
	// ===========================================================================
