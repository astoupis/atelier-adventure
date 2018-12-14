const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
require('../../models');

const Task = mongoose.model('Task');
const List = mongoose.model('List');
const Board = mongoose.model('Board');

function checkup(checkedValue, value){
    let forbidden = true;
    for(let i = 0; i < checkedValue.length; i++){
        if(checkedValue[i].toString() === value) {
            forbidden = false;
            break;
        }
    }
    return forbidden;
}


//GET METHOD
//Get the popup for this specific list (description as well as modification button)
router.get('/:listid/:boardid', function(req, res) {

    let boardId = req.params.boardid; 
    let listId = req.params.listid; 

    req.auth.then(function(payload) {

        Board.findById(boardId, function(err, boardFound) {

            if (!err && boardFound){
                
                //User checkup
                if(checkup(boardFound.users, payload._id)) {
                    res.status(403).end(); 
                    return; 
                }

                //list checkup
                if(checkup(boardFound.lists, listId)) {
                    res.status(403).end(); 
                    return; 
                }
                
                List.findById(listId, function(err, listFound) {
                    if (!err && listFound) {

                        res.json(listFound);

                    } else{
                        res.status(404).end(); 
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

//PUT METHOD
//Modify a specific list name for an existing project
router.put('/', function(req, res){
    
    let boardId = req.body.boardId;
    let listId = req.body.listId; 
    let newName = req.body.listName;

    req.auth.then(function(payload) {

        Board.findById(boardId, function(err, boardFound){

            if (!err && boardFound) {
                let forbidden = true;

                for(let i = 0; i < boardFound.users.length; i++){
                    if(boardFound.users[i].toString() === payload._id) {
                        forbidden = false;
                        break;
                    }
                }

                if(forbidden) {
                    res.status(403).end(); 
                    return; 
                }

                let modifiedList = {name:newName}

                List.findByIdAndUpdate(listId, modifiedList).then(data => {
                    res.json(data); 
                }); 
                        
            } else {
                res.status(400).end();
            }
        }); 
    }).catch(function(error) {
        res.json(error);
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
            
            if (!err && boardFound) {
                let forbidden = true;
                for(let i = 0; i < boardFound.users.length; i++){
                    if(boardFound.users[i].toString() === payload._id) {
                        forbidden = false;
                        break;
                    }
                }
                if(forbidden) {
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
router.delete('/:boardid/:listid', function(req, res) {
    
    let boardId = req.params.boardid;
    let listId = req.params.listid; 

    req.auth.then(function(payload) {
    
        Board.findById(boardId, function(err, boardFound){

            if (!err && boardFound){
                    
                let forbidden = true;

                for(let i = 0; i < boardFound.users.length; i++){
                    if(boardFound.users[i].toString() === payload._id) {
                        forbidden = false;
                        break;
                    }
                }
                if(forbidden) {
                    res.status(403).end(); 
                    return; 
                }

                List.findById(listId, function(err, listFound){
                    if (!err && listFound){

                        let forbidden = true;

                        for(let i = 0; i < boardFound.lists.length; i++){
                            if(boardFound.lists[i].toString() === listId) {
                                forbidden = false;
                                break;
                            }
                        }

                        if(forbidden) {
                            res.status(403).end(); 
                            return; 
                        }

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
                                                res.status(400).end("lol");
                                            }
                                        });
            
                                    } else {
                                        console.log('here1')
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
                                    lists.splice(idIndex, 1); 

                                    Board.findByIdAndUpdate(boardId, {lists:lists}).then(data => {
                                        Board.findById(boardId, function(err, boardFound2){
                                            res.json(boardFound2); 
                                        })
                                         
                                    }); 
                                    
                                } else {
                                    console.log('here2')
                                    res.status(400).end();
                                }
                            });
                    
                        });

                    }else{
                        console.log('here2')
                        res.status(400).end();
                    }
                }); 

            }else{
                console.log('here4')
                res.status(400).end();
            }
        });

    }).catch(function(error) {
        res.json(error);
    });

}); 



module.exports = router;
