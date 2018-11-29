const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../../models');
const User = mongoose.model('User');

router.get('/', function(req, res) {

    res.render("register"); 
});

router.post('/', function(req, res) {
    
    const user = new User({
        username: req.body.username,
        passwordHash:req.body.password
    });

    // save it in the database
    user.save(function(err, saved) {
        // if everything goes well
        if (!err) {
            if (req.accepts("html")) {
                res.redirect("/user/"+saved._id);
            } else {
                res.json(user);
            }
        // if something went wrong
        } else {
            //code of response
            res.status(400).end();
        }
    });
});

module.exports = router;