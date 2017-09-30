
var mongoose = require('mongoose');

module.exports = mongoose.model('Contact',{
	id: String,
	name: String,
	email: String,
	message: String
});