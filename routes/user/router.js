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

    var query = new RegExp(req.query.search, 'i');

    User.find().or([
        {firstname: query},
        {lastname: query},
        {username: query},
        {email: query}
    ]).then(users => {
        
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
router.put('/:userid', function(req, res){
    var userId = req.params.userid; 
    var user = {}

    //Assign the different values which don't create problem if duplicate
    if (req.body.firstname){
        user.firstname = req.body.firstname;
    }

    if (req.body.lastname){
        user.lastname = req.body.lastname;
    }

    if (req.body.email){
        user.email = req.body.email
    }

    //Assign the username and check the validity of this later
    if (req.body.username){

            User.find({username: req.body.username})
                .then(found => {
                    console.log(found)
                    
                    if (found.length === 0){

                        user.username = req.body.username;
                        
                        if (req.body.password){
                            
                            bcrypt.hash(req.body.password, 10).then(function(hash) {
                                user.password = hash; 

                                User.findByIdAndUpdate(userId, user)
                                .then(data => {
                                    res.json(data); 
                                }); 

                            });

                        }else{
                            
                            User.findByIdAndUpdate(userId, user)
                                .then(data => {
                                    res.json(data); 
                                }); 
                        }

                    }else{
                        console.log('here')
                        res.status(403).end();
                    }
                });

    }else{
        if (req.body.password){

            bcrypt.hash(req.body.password, 10).then(function(hash) {
                user.password = hash; 

                User.findByIdAndUpdate(userId, user)
                    .then(data => {
                        res.json(data); 
                    }); 
            });

        }

    }

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
