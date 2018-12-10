const express = require('express');
const router = express.Router();

//GET METHOD
//If session is active get the user page
//If session is not active, get the login/regsitration page
router.get('/', function(req, res) {
    req.auth.then(function(payload) {
        res.redirect('/user/' + payload._id); 
    })
    .catch(function(error) {
        res.redirect('/login'); 
    });
});

module.exports = router;
