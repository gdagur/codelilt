var Book = require('../models/book');

module.exports = function(req,res){

    getBooks = function(err,result){

          Book.find({}, 'url name rating imageUrl').limit(100).sort({ rating: -1 }).exec(callback);;
    }

    callback = function(err, books) 
        {
            if (err)
            {
               console.log("error occured in reading",err);
               res.send(err);
           }
           res.send(books);
        }
    getBooks();

}