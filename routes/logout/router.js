const express = require('express');
const router = express.Router();

const config = require('../../config');


//GET METHOD
//Spoils the cookie token and redirects to the root
router.get('/', function(req, res) {
    res.cookie(config.auth.cookie, "invalid.token.string");
    res.redirect("/");
});


module.exports = router;
