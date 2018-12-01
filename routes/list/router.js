const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const mongoose = require('mongoose');
require('../../models');

const List = mongoose.model('List');
const Board = mongoose.model('Board');


//GET METHOD
//Get or refresh all the columns and their task inside a project
router.get('/:boardid', function(req, res) {
    
    Board.findById(req.params.boardid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else{
            
        }
    });
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
    
    const list = new List({
        name : req.body.listName
    })
    
    list.save(function(err, saved) {
        if (!err) {
            if (req.accepts("html")) {
                //TODO
            } else {
                res.json(saved);
            }
        } else {
            res.status(400).end();
        }
    });

});

//DELETE METHOD
//Delete a specific list and all its tasks in an existing project
router.delete('/:taskid', function(req, res) {

}); 



module.exports = router;
