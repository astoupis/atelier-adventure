const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');

//GET METHOD
//Get the login page/popup
router.get('/', function(req, res) {
});

//POST METHOD
//Login action (get sesssion/create authentification token)
router.post('/', function(req, res) {
    
});

module.exports = router;
