const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
require('../../models');

const Task = mongoose.model('Task');
const List = mongoose.model('List');
const Board = mongoose.model('Board');
const User = mongoose.model('User');


//GET METHOD
//Get the popup for this specific list (description as well as modification button)
router.get('/:listid', function(req, res) {
    
    List.findById(req.params.listid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else{
            res.json(found); 
        }
    });

});

//PUT METHOD
//Modify a specific list name for an existing project
router.put('/:listid', function(req, res){
    
    let boardId = req.body.boardId;
    let listId = req.params.listid; 
    let newName = req.body.listName;

    Board.findById(boardId, function(err, found){

        if (!err && found){

            let modifiedList = {name:newName}

            List.findByIdAndUpdate(listId, modifiedList).then(data => {
                res.json(data); 
            }); 
                    
        } else {
            res.status(400).end();
        }
    }); 


});

//POST METHOD 
//Creat a new list for an existing project
router.post('/', function(req, res) {
    

    req.auth.then(function(payload) {
        
        let boardId = req.body.boardId;
        
        const list = new List({
            name : req.body.listName
        })

        Board.findById(boardId, function(err, boardFound){

            if (!err && boardFound){
                
                if(!boardFound.users.toString().includes(payload._id)){
                    res.status(403).end(); 
                    return; 
                }

                list.save(function(err, saved) {
                    if (!err && saved) { 
                        
                        let lists = boardFound.lists; 
                        lists.push(saved._id);
                        
                        Board.findByIdAndUpdate(boardId, {lists:lists}).then(data => {
                            res.json(data); 
                        }); 
                        
                    } else {
                        res.status(400).end();
                    }
                });
            }else{
                res.status(400).end();
            }
        });

    }).catch(function(error) {
        res.json(error);
    });

});

//DELETE METHOD
//Delete a specific list and all its tasks in an existing project
router.delete('/:listid', function(req, res) {
    
    let boardId = req.body.boardId;
    let listId = req.params.listid; 
    
    Board.findById(boardId, function(err, boardFound){

        if (!err && boardFound){
            List.findById(listId, function(err, listFound){
                if (!err && listFound){

                    let taskIdToBeRemoved = listFound.tasks; 
                    
                    //remove all tasks from the database 
                    var promises = taskIdToBeRemoved.map(function(taskId) {
                        return new Promise(function(resolve, reject) {
                
                            Task.findById(taskId, function(err, taskFound) {
                                if (!err && taskFound) {

                                    taskFound.remove(function (err, taskRemoved) {
                                        if (!err) {
                                            resolve();
                                        } else {
                                            res.status(400).end();
                                        }
                                    });
        
                                } else {
                                    res.status(400).end();
                                }
                            });
                        });
                    });
                      
                    Promise.all(promises)
                    .then(function() {
                        //remove the list
                        listFound.remove(function (err, listRemoved){
                            if (!err) {

                                let lists = boardFound.lists;
                                let idIndex = lists.indexOf(listId); 
                                lists.splice(idIndex, idIndex+1);

                                Board.findByIdAndUpdate(boardId, {lists:lists}).then(data => {
                                    res.json(data); 
                                }); 
                                
                            } else {
                                res.status(400).end();
                            }
                        });
                   
                    });

                }else{
                    res.status(400).end();
                }
            }); 
        }else{
            res.status(400).end();
        }
    }); 
}); 



module.exports = router;
