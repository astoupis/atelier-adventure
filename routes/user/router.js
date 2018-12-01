const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../../models');
const Board = mongoose.model('User');

//GET METHOD
//Get a list of all the user of the plateform
router.get('/all', function(req, res) {

});

//Search among the user for a specific one
router.get('/search', function(req, res) {

});

//get the page for this specific user
router.get('/:userid', function(req, res) {

});

//PUT METHOD
//Modify the details of a specific user
router.put('/:userid', function(req, res){

});

//POST METHOD

//DELETE METHOD
//Delete a specific user completely from the server
router.delete('/:userid', function(req, res) {

}); 



module.exports = router;
