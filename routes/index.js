var express = require('express');
var router = express.Router();
var saveContact = require('../db/savecontact');
var blog = require('../db/blog');
var sitemap = require('../sitemap/sitemap');
var qNotes = require('../db/qNotes');
var bookData = require('../db/books');

router.get('/coming-soon', function(req, res, next) {
	res.render('coming-soon', { title: 'Coming-soon' });
});

router.get('/signup', function(req, res){
	res.render('register',{message: req.flash('message')});
});

router.get('/about', function(req, res, next) {
	res.render('about', { user: req.user });
});

router.get('/contact', function(req, res, next) {
	res.render('contact', { user: req.user });
});

router.post('/submit-contact',function(req, res, next) {
	saveContact(req, res);
});

router.get('/', function(req, res){
	res.render('single', { user: req.user });
});

router.get('/blog', function(req, res) {
	blog(req,res);
});

router.get('/sitemap.xml', function(req, res) {
	sitemap(res);
});

router.get('/notes', function(req, res, next) {
	qNotes.getNotes(req,res);
});

router.post('/save-get', function(req, res, next) {
	qNotes.saveAndGet(req,res);
});

router.post('/save-note', function(req, res, next) {
	qNotes.saveNote(req,res);
});

router.get('/reads', function(req, res, next) {
	res.render('reads', { user: req.user });
});

router.get('/data/books', function(req, res, next) {
	bookData(req, res);
});

module.exports = router;
