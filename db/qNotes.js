        var Note = require('../models/note');

        module.exports = 

        { newNote: function(req,res){

            createNote = function(){
                    
                    if(req.user){
                    var note = new Note();
                    note.title = req.body.title;
                    note.isPublic = req.param("isPublic");
                    note.content = req.param("content");
                    note.user = req.user.username;
                    Note.count({title: note.title, user:note.user}, function(err, count){
                        if(count>0){
                            res.send({noteExists:true});
                        }else{
                            note.save(function(err) {
                                    if (err){
                                        console.log('Error in Saving article: '+err);  
                                        throw err;  
                                    } 
                                    res.send({success:true});
                                });
                        }
                    });
                }else{
                    res.send({error:'Please login to create notes <a href="/login">Login</a>'});
                }



          }
                    // Delay the execution of findOrCreateUser and execute the method
                    // in the next tick of the event loop
                    process.nextTick(createNote);

        },

        getNotes : function(req,res){
                    title = req.param("title");
                    isPublic = req.param("isPublic");
                    content = req.param("content");
                    var user = null;
                    if(req.user){
                        user = req.user.username;
                    }

                Note.find({$or: [{user:user}, {isPublic:true}]},function (err,notes) {
                  if (err) {
                    console.log("error occured in related update", err);
                    res.send(err);
                  }
                  var myNotes = [];
                  var publicNotes = [];
                  var displayNote = null;
                  if(notes.length>0){
                    for(var i=0; i< notes.length; i++){
                        if(notes[i].user == user){
                            myNotes.push(notes[i]);
                        }else{
                            publicNotes.push(notes[i]);
                        }
                    }
                    if(myNotes.length>0){
                        displayNote = myNotes[0];
                    }else if(publicNotes.length>0){
                        displayNote = publicNotes[0];
                    }
                    res.render("notes", {myNotes: myNotes,note:displayNote,user:req.user,publicNotes:publicNotes});
                   }else{
                    res.render("notes",{user:req.user});
                   }
                });
            },

        saveNote : function(req,res){
                    title = req.param("title");
                    isPublic = req.param("isPublic");
                    content = req.param("content");
                    var user = null;
                    if(req.user){
                        user = req.user.username;
                    }

                Note.update({user:user, title:title},{ $set:{content:content, isPublic:isPublic} },function (err) {
                  if (err) {
                    console.log("error occured in related update", err);
                    res.send(err);
                  }
                  res.send({success: true});
                });
            },
        saveAndGet : function(req,res){
                    title = req.param("title");
                    clickedTitle = req.param("clickedTitle");
                    isPublic = req.param("isPublic");
                    content = req.param("content");
                    var user = null;
                    if(req.user && title){
                        user = req.user.username;
                        Note.update({user:user, title:title},{ $set:{content:content} },function (err) {
                          if (err) {
                            console.log("error occured in related update", err);
                            res.send(err);
                        }

                        if(req.body.user == req.user.username){

                            Note.findOne({user:user, title:clickedTitle},function (err,note) {
                                if (err) {
                                    console.log("error occured in related update", err);
                                    res.send(err);
                                }
                                res.send({note: note,user:user,canEdit:true});
                            });
                        }else{   
                            Note.findOne({user:req.body.user, title:clickedTitle,isPublic:true},function (err,note) {
                                if (err) {
                                    console.log("error occured in related update", err);
                                    res.send(err);
                                }
                                res.send({note: note,user:user});
                            });
                        }
                    });
                    }else{
                        Note.findOne({user:req.body.user, title:clickedTitle,isPublic:true},function (err,note) {
                          if (err) {
                            console.log("error occured in related update", err);
                            res.send(err);
                        }
                        res.send({note: note,user:user});
                    });
                    } 
                  
            }             

        }