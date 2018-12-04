const express = require('express');
const router = express.Router();
<<<<<<< HEAD
=======
//const auth = require("../../util/auth");

>>>>>>> 4995aefa8aa8e9b9b7b7726c03d0a04c4d48ac45

//GET METHOD
//If session is active get the user page
//If session is not active, get the login/regsitration page
router.get('/', function(req, res) {
<<<<<<< HEAD
    
    req.auth.then(function(payload) {
        res.redirect('/user/' + payload._id); 
    })
    .catch(function(error) {
        res.redirect('/login'); 
=======
    // THIS ROUTE IS NOW USED FOR VERIFICATION TESTING
    
    req.auth.then(function(payload) {
        res.json(payload);
    }).catch(function(error) {
        res.json(error);
>>>>>>> 4995aefa8aa8e9b9b7b7726c03d0a04c4d48ac45
    });
    
});

module.exports = router;
