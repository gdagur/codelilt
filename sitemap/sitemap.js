
var express = require('express')
, sm = require('sitemap');
var Article = require('../models/article');
module.exports = function(res){
  var pageUrls=[{url:'http://www.codelilt.com/',changefreq:'daily',priority:1.00},
  {url:'http://www.codelilt.com/login',changefreq:'monthly',priority:0.60},
  {url:'http://www.codelilt.com/contact',changefreq:'weekly',priority:0.80},
  {url:'http://www.codelilt.com/about',changefreq:'weekly',priority:0.80},
  {url:'http://www.codelilt.com/blog',changefreq:'daily',priority:0.90},
  {url:'http://www.codelilt.com/coming-soon',changefreq:'monthly',priority:0.30},
  {url:'http://www.codelilt.com/signup',changefreq:'monthly',priority:0.50},
  {url:'http://www.codelilt.com/category/aem',changefreq:'daily',priority:0.80},
  {url:'http://www.codelilt.com/category/node',changefreq:'daily',priority:0.80},
  {url:'http://www.codelilt.com/category/web',changefreq:'daily',priority:0.80}];
  Article.find({}, 'url', function(err, mongourls) 
  {

    if(mongourls){
      for(var i=0;i<mongourls.length;i++){
        var obj = {url:"/article/"+mongourls[i].url, changefreq: 'monthly', priority: 0.9};
        pageUrls.push(obj);

      }
    }

    var sitemap = sm.createSitemap ({
      hostname: 'http://www.codelilt.com',
      cacheTime: 600000,        // 600 sec - cache purge period 
      urls: pageUrls
    });

    sitemap.toXML( function (err, xml) {
      if (err) {
        return res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send( xml );
    });

  });

}