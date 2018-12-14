const express = require('express');
const router = express.Router();
const passwordValidator = require('password-validator');

var passwordSchema = new passwordValidator;

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(64)                                   // Maximum length 64
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Password', 'Password123', 'Password1234', 'qwertzuiop']); // Blacklist these values

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

    if (!passwordSchema.validate(req.body.password)){
        res.send({message:"Password between 8 and 64 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, but cannot contain whitespace."}).end();
        return;
    }

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