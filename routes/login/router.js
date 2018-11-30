const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("../../config");

const mongoose = require('mongoose');
require('../../models');
const User = mongoose.model('User');

//GET METHOD
//Get the login page/popup
router.get('/', function(req, res) {

});

//POST METHOD
//Login action (get sesssion/create authentification token)
router.post('/', function(req, res) {

    givenPassword = req.body.password; 

    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        
        if (err) throw err;
        
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            bcrypt.compare(givenPassword, user.passwordHash, function(err, response) {
                if (!response) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire user since that has the password
                    const payload = {
                        username: user.username
                    };
                    var token = jwt.sign(payload, config.secret, {
                        expiresIn: 60*60*12 // expires in 12 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            });
        }
    });
    /*
    bcrypt.compare(givenPassword, hash, function(err, res) {
        // res == true
    });
    */
});

module.exports = router;
