const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../../models');
const Board = mongoose.model('Board');

//GET METHOD
//Get the board with all element or refresh the board completely
router.get('/:boardid', function(req, res) {

});

//Get a list of the users associated with this board
router.get('/:boardid/users', function(req, res) {

});

//PUT METHOD
//Modify some data about the board object
router.put('/:boardid', function(req, res){

});

//POST METHOD 
//Creat a new board (project)
router.post('/', function(req, res) {


});

//Put a new existing user inside the project
router.post('/:boardid/:userid', function (req,res){

}); 

//PUT METHOD 
//Update an existing user inside the project (rights, status, role)
router.put('/:boardid/:userid', function (req,res){

});

//DELETE METHOD
//Delete a specific board completely 
router.delete('/:boardid', function(req, res) {

});

//Delete a specific user from a specific board 
router.delete('/:boardid/:userid', function(req, res) {

});


module.exports = router;
