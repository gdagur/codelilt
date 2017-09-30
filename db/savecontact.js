var Article = require('../models/article');
var Contact = require('../models/contact');

module.exports = function(req,res){

    saveContact = function(){

      Contact.count({}, function(err, c) {
        if (err){
            console.log('Error in getting contacts count: '+err);  
            throw err;  
        }
        if(c<50)
        {
            var contactUs = new Contact();
            contactUs.email = req.param("email");
            contactUs.name = req.param("name");
            contactUs.message = req.param("message");
            contactUs.save(function(err) {
                if (err){
                    console.log('Error in Saving contact: '+err);  
                    throw err;  
                } 
                res.render('contact', { thankyou: "Thank you. I'll get back to you with in 24 hours" });
            });
        }

    });


  }
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(saveContact);

        }