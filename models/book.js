
var mongoose = require('mongoose');

module.exports = mongoose.model('Book',{
	id: String,
	url: String,
	name: String,
	imageUrl: String,
	rating: Number
});