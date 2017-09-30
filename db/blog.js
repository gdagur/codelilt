var Article = require('../models/article');
var express = require('express');
var async = require('async');
module.exports = function(req,res){
var aemCount = 0;
var webCount = 0;
var nodeCount = 0;
var distributedSystems = 0;
var articles=null;
var popularPost=null;

 async.parallel([function(cb) {
   Article.count({tags: 'web',isPublished:true}, function(err, c) {
       webCount=c;
       cb(null,"web");
   });
},function(cb) {
   Article.count({tags: 'aem',isPublished:true}, function(err, c) {
       aemCount=c;
       cb(null,"aem");
   });
}, function(cb) {
   Article.count({tags: 'node',isPublished:true}, function(err, c) {
       nodeCount=c;
       cb(null,"node");
   });
}, function(cb) {
   Article.count({tags: 'distributed-systems',isPublished:true}, function(err, c) {
       distributedSystems=c;
       cb(null,"distributed-systems");
   });
}, function(cb) {
   Article.find({isPublished:true}).sort({ date: -1 }).exec(function(err, blogs) {
    if (err){
      console.log("error nside passport blog.js, getting blog articles",err);
      next(err);
    }
    else{
      articles = blogs;
    }
       cb(null,"blogs");
   });
}, function(cb) {
   Article.find({isPublished:true}).sort({ views: -1 }).limit(6).exec(function(err, blogs) {
    if (err){
      console.log("error nside passport blog.js, getting blog articles",err);
      next(err);
    }
    else{
      popularPost = blogs;
    }
       cb(null,"blogs");
   });
}],function(err, results){
    if(err){
        console.log("Arrgghh!!", err)
        res.send(err);
    }else{
        var categoryCount = {aem:aemCount,node:nodeCount,web:webCount,distributedSystems:distributedSystems};
        res.render("blog", { posts: articles,popular:popularPost, user: req.user, categoryCount:categoryCount});
    }
});

}