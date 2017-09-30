var Article = require('../models/article');
var express = require('express');

module.exports = function(req,res){

        saveArticle = function(){
            var article = new Article();
            var heading = req.param("heading");
            var category = req.param("category");
            var tags = req.param("tags");
            article.heading = heading;
            article.category = category;
            article.tags = tags;
            article.content = req.param("article");
            article.username = req.param("username");
            if(req.param("username")== 'gajendra'){
                article.isPublished = true;
            }else{
                article.isPublished = false;
            }
            var d = new Date();
            var n = d.toLocaleDateString();
            article.date = n;
            var link = heading.replace(/ - /g, '-');
            link = link.replace(/ [\/\\.()|[\]{},] /g, "-");
            link = link.replace(/[\/\\.()|[\]{},]/g, "-");
            link = link.replace(/ /g, '-');
            link = link.replace(/--/g, '-');
            article.url = link;
            if(heading && article.content){
                        article.save(function(err) {
                            if (err){
                                console.log('Error in Saving article: '+err);  
                                throw err;  
                            } 
                            res.redirect('/article/'+link);
                        });

                    }

            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(saveArticle);

    }