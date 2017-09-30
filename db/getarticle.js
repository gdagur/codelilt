var Article = require('../models/article');
var RelatedArticles = require('../models/related');
var express = require('express');
var async = require('async');
var aemCount = 0;
var webCount = 0;
var nodeCount = 0;
var related = [];

module.exports = function(req,res){

    var path = req.originalUrl;

    getArticle = function(err,result){
        var categoryCount = {aem:aemCount,node:nodeCount,web:webCount};
        Article.findOneAndUpdate({url: req.params.article}, { $inc: { views: 1}}).exec(function(err, article)
        {
            if (err)
            {
               console.log("error occured in reading",err);
               res.send(err);
           }

           if(article){
                var viewss=0;
                if(article.views !== undefined){
                 viewss=article.views
                }
                var tags = [];
                var category = {};
                for(var i=0; i<article.tags.length;i++){
                    var tag = article.tags[i];
                    if(tag == 'aem' || tag == 'web' || tag == 'node'){
                        category[tag] = tag;
                    }else{
                        tags.push(tag);
                    }
                }
            if(req.user && req.user.username){
                if(req.user.username == article.username){
                    res.render("article", {article: article,views:viewss, user: req.user, showEdit:true, category:category,tags:tags, categoryCount:categoryCount,related:related});
                }else{
                    res.render("article", {article: article,views:viewss, user: req.user,tags:tags, categoryCount:categoryCount,related:related});
                }
            }else{
                res.render("article", {article: article,views:viewss, user: req.user, tags:tags, categoryCount:categoryCount,related:related});
            }
        }else{
            console.log("error occured in getting article ",err);
            res.send(err);
        }

    });

  }

cb = function(err,data){
    return;
}


async.parallel([function(cb) {
   Article.count({tags: 'web', isPublished:true}, function(err, c) {
       webCount=c;
       cb(null,"web");
   });
},function(cb) {
   Article.count({tags: 'aem', isPublished:true}, function(err, c) {
       aemCount=c;
       cb(null,"aem");
   });
}, function(cb) {
   Article.count({tags: 'node', isPublished:true}, function(err, c) {
       nodeCount=c;
       cb(null,"node");
   });
},function(cb) {
   RelatedArticles.findOne({article: req.params.article},"relatedArticles relatedTitles", function(err, rel) {
       if(err){
        res.send(err);
       }
       if(rel){
       var links = rel.relatedArticles;
       var titles = rel.relatedTitles;
       if(links && titles){
       related = []
       for(var i =0 ; i<links.length;i++){
            var obj = {link:links[i],title:titles[i]};
            related.push(obj);
       }
     }
   }
       cb(null,"related");
   });
}],function(err, results){
    if(err){

        console.log("Arrgghh!!", err)
        res.send(err);
    }else{
        getArticle(err,results);
    }
});



}