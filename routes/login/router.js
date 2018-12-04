const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const config = require('../../config');
const auth = require("../../util/auth");

const mongoose = require('mongoose');
require('../../models');
const User = mongoose.model('User');

//GET METHOD
//Get the login page/popup
router.get('/', function(req, res) {
	res.render("login");
});

//POST METHOD
//Login action (get sesssion/create authentification token)
router.post('/', function(req, res) {
    auth.login(req.body.username, req.body.password)
    .then(function(tokenString) {
        res.set("Set-Cookie", "token=" + tokenString + "; Max-Age=" + config.auth.expirationInSeconds);

        if(req.accepts("html")) res.redirect("/");
        else res.json({ 
            success: true, 
            token: tokenString, 
            message: "Enjoy your token!" , 
        });
    })
    .catch(function(error) {
        console.log("CATCH")
        res.set("Set-Cookie", "token=invalid.cookie.value");
        if(req.accepts("html")) res.redirect("/");
        else res.json({
            success: false, 
            message: error.message,
        });
    });
});

module.exports = router;
