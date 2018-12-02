const express = require('express');
const router = express.Router();
const auth = require("../../util/auth");


//GET METHOD
//If session is active get the user page
//If session is not active, get the login/regsitration page
router.get('/', function(req, res) {
    // THIS ROUTE IS NOW USED FOR VERIFICATION TESTING
    auth.authenticate(req)
    .then(function(payload) {
        res.json(payload);
    })
    .catch(function(error) {
        res.json(error);
    });
});

module.exports = router;
