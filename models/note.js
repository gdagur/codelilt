
var mongoose = require('mongoose');

module.exports = mongoose.model('Note',{
	id: String,
	title: String,
	content: String,
	user: String,
	isPublic: Boolean
});