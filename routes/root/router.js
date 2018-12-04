const express = require('express');
const router = express.Router();

//GET METHOD
//If session is active get the user page
//If session is not active, get the login/regsitration page
router.get('/', function(req, res) {
    // THIS ROUTE IS NOW USED FOR VERIFICATION TESTING
    req.auth.then(function(payload) {
        res.json(payload);
    })
    .catch(function(error) {
        res.json(error);
    });
   
});

module.exports = router;
