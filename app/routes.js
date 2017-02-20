var mysql = require('mysql');
var dbconfig = require('../config/database');

// app/routes.js
module.exports = function(app, passport) {
// ROUTE FOR MOBILE CLIENTS
	// =====================================
	// MAINPAGE SECTION =========================
	// =====================================

	// Order routes
	app.post('/orders', function(req, res) {

		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query('SELECT Orders.Order_id, Users.First_name, Users.Last_name, Restaurants.Name as NameRestaurant, Orders.Status, Orders.Date_Order, Orders.Time_Order, Orders.Date_Deli, Orders.Time_Deli, Orders.Sum \
		 									FROM Users, Restaurants, Orders \
											WHERE Orders.Restaurant_id = Restaurants.Restaurant_id \
											and Users.id = Orders.id \
											and Orders.id = ' + req.body.id + ' ',
										function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);
			res.json(rows);
		});
		connection.end();
	});

	app.post('/orders/accept', function(req, res) {
		console.log(req.body.Order_id);
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query('UPDATE Orders SET Orders.Status = ? WHERE Order_id = ?',
		 								["Accepted", req.body.Order_id],
										function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);
			res.sendStatus(200);
		});
		connection.end();
	});

	app.post('/orders/cancel', function(req, res) {
		console.log(req.body.Order_id);
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query('UPDATE Orders SET Orders.Status = ? WHERE Order_id = ?',
										["Cancelled", req.body.Order_id],
										function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);
			res.sendStatus(200);
		});
		connection.end();
	});

	app.post('/orders/new', function(req, res){
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query("INSERT INTO Orders ( id, Restaurant_id, Status, Sum ) values (?,?,?,?)",
										[	req.body.user_id,
											req.body.restaurant_id, req.body.status,
											req.body.order_price ],
											function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);
			res.sendStatus(200);
		});

		connection.end();

	});

	// Menu routes
	app.get('/menu', function(req, res){
		var connection = mysql.createConnection(dbconfig.connection);

		connection.query('USE ' + dbconfig.database);

		console.log('Your ID is: ', req.user.id);
		console.log('Your name is: ', req.user.email);

		connection.query('SELECT Items.Item_id, Items.Restaurant_id, Restaurants.Restaurant_id, Items.Name, Items.Description, Items.Item_logo, Items.Price \
							FROM Items, Restaurants \
							WHERE Items.Restaurant_id = Restaurants.Restaurant_id \
							and Restaurants.Restaurant_id = ' + req.user.id + ' ',
								function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);

			res.render('menu.ejs', {
				user: req.user,
				data: rows

			})
		});
		connection.end();
	});

	app.post('/menu', function(req, res){
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query("INSERT INTO Items ( name, description, Item_logo, price, Restaurant_id) values (?,?,?,?,?)",
											[req.body.name, req.body.description,req.body.logo, req.body.price, req.user.id],
								function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);

			res.render('menu.ejs', {
				user: req.user,
				data: rows

			})
		});
		connection.end();
	})

	app.post('/menu/delete', function(req, res){
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);
		console.log(req.body);
		connection.query("DELETE FROM Items WHERE Item_id = " + req.body.Item_id,
								function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);

			res.sendStatus(200);
		});
		connection.end();
	})

	app.post('/clientLogin', function(req, res) {
		console.log(req.body);
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query('SELECT * FROM Users WHERE Role_id = 1',
										function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);
			var Users = rows;

			var user = Users.find(function(element){
					 return (element.email === req.body.username) && (element.password === req.body.password);
			});

			if(user !== undefined)
			{
					return res.json({id: user.id, username: user.email});
			}
			else
			{
					return res.sendStatus(401);
			}
		});
		connection.end();

	});

	app.post('/clientSignup', function(req, res){
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query("INSERT INTO Users ( email, password, Role_id ) values (?,?,?)",
											[req.body.username, req.body.password, "1"],
											function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);
			res.sendStatus(200);
		});

		connection.end();

	});

	app.get('/restaurants', function(req, res){
		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query('SELECT * FROM Restaurants',
										function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);

			res.json(rows);
		});
		connection.end();
	});

	app.post('/account', function(req, res) {

		var connection = mysql.createConnection(dbconfig.connection);
		connection.query('USE ' + dbconfig.database);

		connection.query('SELECT * FROM Users WHERE Users.id = ' + req.body.id + ' ',
							function (error, rows, fields) {
			if (error) throw error;
			console.log('The solution is: ', rows);
			res.json(rows);
		});
		connection.end();
	});

	// app.post('/items', function(req, res){
	// 	var connection = mysql.createConnection(dbconfig.connection);
	// 	connection.query('USE ' + dbconfig.database);

	// 	connection.query('SELECT Items.Item_id, Items.Restaurant_id, Restaurants.Restaurant_id \
	// 	 					FROM Items, Restaurants\
	// 						WHERE Items.Restaurant_id = Restaurants.Restaurant_id \
	// 						and Users.id = Orders.id \
	// 						and Orders.id = ' + req.body.id + ' ',
	// 									function (error, rows, fields) {
	// 		if (error) throw error;
	// 		console.log('The solution is: ', rows);
	// 		res.json(rows);
	// 	});
	// 	connection.end();
	// })


// ROUTE FOR BROWSER CLIENTS
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

		var connection = mysql.createConnection(dbconfig.connection);

		connection.query('USE ' + dbconfig.database);

		console.log('Your ID is: ', req.user.id);
		console.log('Your name is: ', req.user.email);

		connection.query('SELECT Orders.Order_id, Users.First_name, Users.Last_name, Users.Phone, Users.email, Users.Address, Orders.Date_Order, Orders.Time_Order, Orders.Date_Deli, Orders.Time_Deli, Orders.Sum, Orders.Status \
		 									FROM Orders, Restaurants, Users \
											WHERE Orders.Restaurant_id = Restaurants.Restaurant_id \
											and Users.id = Orders.id \
											and Orders.Restaurant_id = ' + req.user.id + ' ',
										function (error, rows, fields) {
		  if (error) throw error;
		  console.log('The solution is: ', rows);
			res.render('index.ejs', {
				user : req.user, // get the user out of session and pass to template
				data : rows
			});
		});
		connection.end();
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
