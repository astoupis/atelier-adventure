const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
require('../../models');
const User = mongoose.model('User');

const bcrypt = require('bcrypt')

//GET METHOD
//Get a list of all the user of the plateform
router.get('/all', function(req, res) {

    User.find({}, function(err, users) {
        var userArray = [];
    
        users.forEach(function(user) {
            userArray.push({
                lastname: user.lastname,
                firstname: user.firstname,
                username: user.username,
                email: user.email
            });
        });
    
        res.json(userArray);  
    });
});

//Search among the user for a specific one
//By username, lastname, firstname, email
router.get('/search', function(req, res) {

    req.auth.then(function(payload) {

        //var query = new RegExp(req.query.search, 'i');
        var query = req.query.search; 

        User.find().or([
            {username: query},
            {email: query}
        ]).then(users => {
            
            var userArray = [];
        
            users.forEach(function(user) {
                if (user._id != payload._id){
                    userArray.push({
                        _id: user._id,
                        lastname: user.lastname,
                        firstname: user.firstname,
                        username: user.username,
                        email: user.email
                    });
                }
            });

            res.json(userArray);
        });

    }).catch(function(error) {
        res.json(error);
    });

});


// get the page for the user, which is the token owner
// Authentication needed
// TODO
router.get('/', function(req, res) {
    req.auth.then(function(payload) {
        User.findById(payload._id).exec()
        .then(function(found) {
            var user = {
                _id : found._id,
                boards : found.boards,
                assignedTasks : found.assignedTasks,
                firstname : found.firstname,
                lastname : found.lastname,
                username : found.username,
                email : found.email,
                dateCreated : found.dateCreated
            };
            res.json(user);
        })
        .catch(function(error) {
            res.json(error);
        });
    })
    .catch(function(error) {
        res.json(error);
    });
});


//get the page for this specific user
//Authentification needed
router.get('/:userid', function(req, res) {
    User.findById(req.params.userid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else if (req.accepts("html")) {
            
            var user = {
                _id : found._id,
                boards : found.boards,
                assignedTasks : found.assignedTasks,
                firstname : found.firstname,
                lastname : found.lastname,
                username : found.username,
                email : found.email,
                dateCreated : found.dateCreated
            }

            res.render("userpage", {result:user});

        } else if (req.accepts("json")) {
            
            var user = {
                _id : found._id,
                boards : found.boards,
                assignedTasks : found.assignedTasks,
                firstname : found.firstname,
                lastname : found.lastname,
                username : found.username,
                email : found.email,
                dateCreated : found.dateCreated
            }
            
            res.json(user);
        }
    });
  
});


//PUT METHOD
//Modify the details of a specific user
//Email, password, firstname, lastname, username, 
router.put('/', function(req, res){

    req.auth.then(function(payload) {
        
        var userId = {_id : payload._id}; 
        var user = {}

        //Assign the different values which don't create problem if duplicate
        if (req.body.firstname){
            user.firstname = req.body.firstname;
        }

        if (req.body.lastname){
            user.lastname = req.body.lastname;
        }

        if (req.body.email){
            user.email = req.body.email; 
        }

        if (req.body.username){
            user.username = req.body.username;
        }

        if (req.body.password){
            
            bcrypt.hash(req.body.password, 10).then(function(hash) {
                user.passwordHash = hash; 

                User.findOneAndUpdate(userId, user, {runValidators: true, context: 'query' },
                function(err) {
                    if (err){
                        res.json(err).end();
                    }else{
                        res.json(user).end(); 
                    }
                })

            });

        }else{
            
                User.findOneAndUpdate(userId, user, {runValidators: true, context: 'query' },
                function(err) {
                    if (err){
                        res.json(err).end();
                    }else{
                        res.json(user).end(); 
                    }
                });
                
            }
                

    
    }).catch(function(error) {
        res.json(error);
    });

});

//DELETE METHOD
//Delete a specific user completely from the server
router.delete('/:userid', function(req, res) {
    
    var userId = req.params.userid;

    User.findById(userId, function (err, found) {
        if (err || !found) {
            res.status(404).end();
        } else {
            found.remove(function (err, removed) {
                if (!err) {
                    if (req.accepts('html')) {
                        res.status(200).end();
                    } else {
                        res.status(200).end();
                    }
                } else {
                    res.status(400).end();
                }
            });
        }
    });
}); 



module.exports = router;
