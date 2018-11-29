const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../../models');
const User = mongoose.model('User');

//GET METHOD
//Get the registration page
router.get('/', function(req, res) {

    res.render("register"); 
});

//POST METHOD
//Create a new user
router.post('/', function(req, res) {
    
    const user = new User({
        username: req.body.username,
        passwordHash:req.body.password
    });

    // save it in the database
    user.save(function(err, saved) {
        if (!err) {
            if (req.accepts("html")) {
                res.redirect("/user/"+saved._id);
            } else {
                res.json(user);
            }
        } else {
            res.status(400).end();
        }
    });
});

module.exports = router;