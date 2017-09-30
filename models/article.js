
var mongoose = require('mongoose');
module.exports = mongoose.model('Article',{
	id: String,
	heading: String,
	content: String,
	username: String,
	category: String,
	tags:[String],
	url: String,
	date: String,
  	views:Number,
	isPublished: {type: Boolean, default: true}
});