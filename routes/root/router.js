const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');

//GET METHOD
//If session is active get the user page
//If session is not active, get the login/regsitration page
router.get('/', function(req, res) {

});

module.exports = router;
