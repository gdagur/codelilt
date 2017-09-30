
var mongoose = require('mongoose');

module.exports = mongoose.model('RelatedArticles',{
	id: String,
	article: String,
	relatedArticles: [String],
	relatedTitles: [String]
});