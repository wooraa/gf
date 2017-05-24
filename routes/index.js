//
var Testimony = require('../app/models/testimony');
//
module.exports = function(app, passport) {



// normal routes ===============================================================
// route middleware to ensure user is not logged in
	// app.use('/', notLoggedIn, function(req, res, next) {
	// 	next();
	// });

	// The first page. Thwad welcome page.
	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('general/index');
	});

	// The first page. Thwad welcome page.
	// show the home page (will also have our login links)
	app.get('/inside', function(req, res) {
		res.render('general/inside');
	});

	app.get('/terms-of-privacy', function(req, res) {
		res.render('general/privacy');
	});

	app.get('/about-us', function(req, res) {
		res.render('general/aboutUs');
	});

	app.get('/how-it-works', function(req, res) {
		res.render('general/howItWorks');
	});

	// app.get('/testimonies', function(req, res) {
	// 	res.render('general/testimonies');
	// });

	app.get('/testimonies', function(req, res, next) {
		Testimony.find(function(err, docs) {
			var testimonyChunks = [];
			var chunkSize = 2;
			for (var i = 0; i < docs.length; i += chunkSize) {
				testimonyChunks.push(docs.slice(i, i + chunkSize));
			}
			res.render('general/testimonies', { title: 'Testimonies', testimony: testimonyChunks });
		});
	});


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

// closing curly brace fpr module.exports
};
 