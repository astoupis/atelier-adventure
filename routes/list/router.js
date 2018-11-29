const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../../models');
const Board = mongoose.model('List');

//GET METHOD
//Get or refresh all the columns and their task inside a project
router.get('/', function(req, res) {
  
});

//Get the popup for this specific list (description as well as modification button)
router.get('/:taskid', function(req, res) {
  
});

//PUT METHOD
//Modify a specific list for an existing project
router.put('/:taskid', function(req, res){

});

//POST METHOD 
//Creat a new list for an existing project
router.post('/', function(req, res) {


});

//DELETE METHOD
//Delete a specific list and all its tasks in an existing project
router.delete('/:taskid', function(req, res) {

}); 



module.exports = router;
