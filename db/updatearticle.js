var Article = require('../models/article');
var express = require('express');
 var ObjectId = require('mongodb').ObjectID;
module.exports = function(req,res){

    updateArticle = function(){
        var article = new Article();
        var heading = req.param("heading");
        var category = req.param("category");
        var articleid = req.param("articleid");
        var tags = req.param("tags");
        var link = heading.replace(/ - /g, '-');
        link = link.replace(/ [\/\\.()|[\]{},] /g, "-");
        link = link.replace(/[\/\\.()|[\]{},]/g, "-");
        link = link.replace(/ /g, '-');
        link = link.replace(/--/g, '-');

        Article.findByIdAndUpdate(new ObjectId(articleid), { $set: { heading: heading, content: req.param("article"), url:link,tags:tags}}, function (err, article) {
            if (err){
                console.log('Error in Saving article: '+err);  
                throw err;  
            }
            res.redirect('/article/'+link);
        });

    };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(updateArticle);

        }