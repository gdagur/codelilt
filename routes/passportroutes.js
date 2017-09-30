var express = require('express');
var sm = require('sitemap');
var router = express.Router();
var postart = require('../db/postarticle');
var updateart = require('../db/updatearticle');
var getArticle = require('../db/getarticle');
var getCategory = require('../db/category');
var getdbarticles = require('../db/getdbarticles');
var getdbrelated = require('../db/getdbrelated');
var dbadminupdate = require('../db/dbadminupdate');
var qNotes = require('../db/qNotes');

var isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()){
		return next();
	}else{
	req.session.redirectTo = req.path;
	res.redirect('/login');
}
}

var isAdmin = (req, res, next) => {
	if (req.isAuthenticated() && req.user && req.user.username == 'gajendra'){
		return next();
	}else{
	req.session.redirectTo = req.path;
	res.redirect('/');
}
}

var setRedirection = (req, res, next) => {
	req.session.redirectTo = req.session.redirectTo ? req.session.redirectTo : req.header('Referrer');
	return next();
}

module.exports = (passport) => {
	/* Handle Login POST */
	router.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if (err) { 
				console.log("In authenticate call back error ----", err);
				return next(err); 
			}
			if (!user) { 
				return res.render('login',{message: req.flash('message')}); 
			}
			req.login(user, function(err) {
				if (err) { 
					return next(err); 
				}
				var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
				delete req.session.redirectTo;
				return res.redirect(redirectTo);
				//return res.render('single', { user: user });
   			});
		})(req, res, next);
	});

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	router.get('/login', setRedirection, function(req, res, next) {
  		res.render('login', { title: 'Login', message: req.flash('message') });
	});

	/* GET Home Page */
	router.get('/postarticle', isAuthenticated, function(req, res){
		res.render('postarticle', { user: req.user });
	});

	router.get('/dbadmin', isAdmin, function(req, res){
		res.render('dbadmin', { user: req.user });
		//dbadmin(req,res);
	});

	router.get('/getdbarticle', isAuthenticated, function(req, res){
		getdbarticles(req,res);
	});

	router.post('/getdbarticle', isAuthenticated, function(req, res){
		getdbarticles(req,res);
	});

	router.get('/getdbrelated', isAuthenticated, function(req, res){
		getdbrelated(req,res);
	});
	router.post('/dbadminupdate', isAdmin, function(req, res){
		dbadminupdate(req,res);
	});

	router.post('/postarticle', isAuthenticated, function(req,res){
		postart(req,res);
	});

	router.post('/updatearticle', isAuthenticated, function(req,res){
		updateart(req,res);
	});

	router.get('/article/:article', function(req, res) {
		getArticle(req,res);
	});
	router.get('/category/:cat', function(req, res) {
		getCategory(req,res);
	});
	router.get('/aem/:cat', function(req, res) {
		res.status(301);
		res.header( "Location", "/article/"+req.params.cat );
		res.send();
	});
	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.post('/create-note', isAuthenticated, function(req, res, next) {
	qNotes.newNote(req,res);
});

	return router;
}





