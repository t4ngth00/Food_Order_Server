var mysql = require('mysql');
var dbconfig = require('../config/database');

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form

	app.get('/', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
	});

	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/index', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/index', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// MAINPAGE SECTION =========================
	// =====================================
	app.get('/index', isLoggedIn, function(req, res) {
		var tabledata = [
				{ Order_id: 'Bloody Mary', First_name: 3 },
				{ Order_id: 'Martini', First_name: 5 },
				{ Order_id: 'Scotch', First_name: 10 }
		]
		var connection = mysql.createConnection(dbconfig.connection);

		connection.query('USE ' + dbconfig.database);
		connection.query('SELECT Orders.Order_id, Users.First_name, Users.Last_name, Users.Phone, Users.email, Users.Address, Orders.Date_Order, Orders.Time_Order, Orders.Date_Deli, Orders.Time_Deli, Items.Name, Items.Price , Orders_Detail.Quantity, Orders.Sum, Orders.States \
		 									FROM Orders, Restaurants, Users, Orders_Detail, Items \
											WHERE Orders.Restaurant_id = Restaurants.Restaurant_id \
											and Users.id = Orders.id \
											and Orders_Detail.Item_id = Items.Item_id \
											and Orders.Order_id = Orders_Detail.Order_id \
											and Orders.Restaurant_id = ' + req.user.id + ' ',
										function (error, results, fields) {
		  if (error) throw error;
		  console.log('The solution is: ', results);
			res.render('index.ejs', {
				user : req.user, // get the user out of session and pass to template
				data : results
			});
		});


	});



	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
