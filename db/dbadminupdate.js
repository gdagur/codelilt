  var Related = require('../models/related');
  var Article = require('../models/article');
  var relatedArticles = {};
  var ObjectId = require('mongodb').ObjectID;
  var async = require('async');
  module.exports = function(req,res){

    var data = req.param("data");
    data =  JSON.parse(data);
    var heading = data.heading;
    var username = data.username;
    var articleId = data.articleId;
    var tags = data.tags;

    var relatedArticles = data.relatedArticles;

    cb = function(err,data){
      return;
    }


    async.parallel([function(cb) {
      Article.findByIdAndUpdate(new ObjectId(articleId), { $set: { heading: heading, username:username, tags:tags}}, function (err, article) {
        if (err){
          console.log('Error in Saving article: '+err);  
          throw err;  
        }
        cb(null, "article");
        
      }); 
    },function(cb) {
      if(relatedArticles.article){
        Related.update({article: relatedArticles.article}, {relatedArticles:relatedArticles.relatedArticles, relatedTitles:relatedArticles.relatedTitles}, {upsert: true}, function (err) {
          if (err) {
            console.log("error occured in related update", err);
            res.send(err);
          }
          cb(null, "rl");
        });
      }
    }],function(err, results){
      if(err){
        res.send("Error occured while updating the Article");
          //res.send(err);
        }else{
          //getRelatedArticle(err,results);
          res.send("Article updated successfully");
        }
      }); 

  }