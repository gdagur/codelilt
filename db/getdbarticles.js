var Article = require('../models/article');
var RelatedArticles = require('../models/related');
var express = require('express');

module.exports = function(req,res){

    getArticle = function(err,result){

        var user = req.param("username");
        var term = req.param("heading");
        var isPublished =  req.param("isPublished");

        if(!user && !term && !isPublished){
          Article.find({}, 'url date username heading tags category', function(err, article) 
        {
            if (err)
            {
               console.log("error occured in reading",err);
               res.send(err);
           }

           res.send(article);

        });

        }else{

        Article.find({username : {$regex : ".*"+user+".*"}, heading:{$regex : ".*"+term+".*"}, isPublished:isPublished},'url date username heading tags category', function(err, article) 
        {
            if (err)
            {
               console.log("error occured in reading",err);
               res.send(err);
           }

           res.send(article);

        });
      }
    }
    getArticle();

}