const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../../models');
const Board = mongoose.model('Task');

//GET METHOD
//Get or refresh all the task in the correct columns inside a project
router.get('/', function(req, res) {
  
});

//Search for tasks or a specific task (inside a specific project)
router.get('/search', function(req, res){

});

//Get the popup for this specific task
router.get('/:taskid', function(req, res) {
  
});

//PUT METHOD
//Modify a specific task
router.put('/:taskid', function(req, res){

});

//Assign a specific task to a specific user which must be inside the project
router.put('/:taskid/:userid', function(req, res){

});

//Put a task into another existing list
router.put('/:taskid/:listid', function(req, res){

});

//POST METHOD 
//Creat a new task for an existing project
router.post('/', function(req, res) {


});

//DELETE METHOD
//Delete a specific task in an existin project
router.delete('/:taskid', function(req, res) {

}); 



module.exports = router;
