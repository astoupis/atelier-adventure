const express = require('express');
const router = express.Router();

//Password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');
require('../../models');
const User = mongoose.model('User');

//GET METHOD
//Get the registration page
router.get('/', function(req, res) {
    res.render("register"); 
});

//POST METHOD
//Create a new user !==Finished==!
router.post('/', function(req, res) {
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        // Store hash in your password DB

        const user = new User({
            firstname : req.body.firstname, 
            lastname : req.body.lastname,
            email : req.body.email,
            username: req.body.username,
            passwordHash: hash
    
        })
        
        user.save(function(err, saved) {
            if (!err) {
                if (req.accepts("html")) {
                    res.redirect("/login");
                } else {
                    res.json(saved);
                }
            } else {
                res.json(err).status(400).end(); 
            }
        });
    });

}); 

module.exports = router;