var Related = require('../models/related');
var Article = require('../models/article');
var relatedArticles = {};
var async = require('async');
module.exports = function(req,res){

cb = function(err,data){
    return;
}

  async.parallel([function(cb) {
    var url = req.param("url");
  Related.findOne({article:req.param("url")}, function(err, c) 
        {
       if(c==null || c==0){
        relatedArticles['related'] = {article:url,relatedArticles:[],relatedTitles:[]};
       }else{

       relatedArticles['related'] = c;
     }
       cb(null,"web");
   }); 
  },function(cb) {
  Article.find({}, 'heading url' ,function(err, c) {
      
       relatedArticles['all'] = c;
        cb(null,"aem");
   }); 
}],function(err, results){
    if(err){
        res.send(err);
    }else{
        //getRelatedArticle(err,results);
        res.send(relatedArticles);
    }
}); 

}