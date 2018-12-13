const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
//const auth = require("../../util/auth");


const mongoose = require('mongoose');
require('../../models');
const Board = mongoose.model('Board');
const List = mongoose.model('List');
const User = mongoose.model('User');
const Task = mongoose.model('Task')

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
//Get the board with all element or refresh the board completely
//Authorization
router.get('/:boardid', function(req, res) {
    req.auth.then(function(payload) {
        Board.findById(req.params.boardid).populate('users', ['-passwordHash', '-boards']).populate('lists').exec(function(err, found) {
            if (!found) {
                res.status(404).end();
            } else if (req.accepts("html")) {
                res.render("board", found);
            } else if (req.accepts("json")) {
                res.json(found);
            }
        });
    })
    .catch(function(error) {
        res.json(error);
    });  

});

//Get a list of the users associated with this board
router.get('/:boardid/users', function(req, res) {
    
    Board.findById(req.params.boardid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else if (req.accepts("html")) {
            res.render("userTemplate", {result: found});
        } else if (req.accepts("json")) {
            
            res.json(found.users);
        }
    });
});

//Get all the columns of a project
router.get('/:boardid/lists', function(req, res) {

    var listOfLists = []
    
    Board.findById(req.params.boardid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else{
            
            let lists = found.lists;
            
            var promises = lists.map(function(listId) {
                return new Promise(function(resolve, reject) {
        
                    List.findById(listId, function(err, found) {
                        if (!err) {
                            listOfLists.push(found);
                            resolve();
                        } else {
                            res.status(400).end();
                        }
                    });
                });
            });
        
              
            Promise.all(promises)
            .then(function() {
                res.json(listOfLists); 
            });
        }
    });
});

//PUT METHOD
//Modify the name of the board object
router.put('/name', function(req, res){

    let boardId = req.body.boardId;
    let boardName = req.body.boardName; 

    req.auth.then(function(payload){

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

                var board = {name: boardName}
        
                Board.findByIdAndUpdate(boardId, board).then(data => {
                    res.json(data); 
                }); 

            }else{
                res.status(400).end(); 
            }
        });

    }).catch(function(error) {
        res.json(error);
    });   
        
});

//Put a new existing user inside the project
router.put('/new-user', function (req,res) {

    let boardId = req.body.boardId;
    let userId = req.body.userId;
    
    req.auth.then(function(payload) {
        var board = {}

        Board.findById(boardId, function(err, found) {
            if (!found) {
                res.status(404).end();
            } else {
                board = found;

                if(checkup(board.users, payload._id)) {
                    res.status(403).end();
                    return;
                }
                board.users.addToSet(userId);

                Board.findByIdAndUpdate(boardId, board).then(data1 => {
                    
                    User.findById(userId, function(err, userFound){

                        let boards = userFound.boards;
                        boards.addToSet(boardId); 

                        User.findByIdAndUpdate(userId, {boards:boards}).then(data2 => {
                            res.json(data2); 
                        });
                    });

                }); 
            }
        });
    })
    .catch(function(error) {
        res.json(error);
    });
});


//POST METHOD 
//Creat a new board (project)
//Need an authorization, create a new board with the user who create it as admin, 
//then he can invite other users
router.post('/', function(req, res) {
    
    req.auth.then(function(payload) {
        //The array is initialized with the current user who create it
        let userId = payload._id;
        let arrayUser = [userId];
        let arrayList = [];
        let arrayListId = [];
        let boardName = req.body.name;

        if (req.body.list1) arrayList.push(req.body.list1);
        if (req.body.list2) arrayList.push(req.body.list2);
        if (req.body.list3) arrayList.push(req.body.list3);
        if (req.body.list4) arrayList.push(req.body.list4);
        if (req.body.list5) arrayList.push(req.body.list5);

        var promises = arrayList.map(function(name) {
            return new Promise(function(resolve, reject) {
                
                list = new List({
                    name: name
                })

                list.save(function(err, saved) {
                    if (!err) {
                        arrayListId.push(saved._id);
                        resolve();
                    } else {
                        res.status(400).end();
                    }
                });
            });
        });

        
        Promise.all(promises)
        .then(function() { 

            const board = new Board({
                name : boardName, 
                users : arrayUser,
                lists : arrayListId
            })
            
            board.save(function(err, savedBoard) {
                if (!err) {
                    User.findById(payload._id, function(err, userFound) {
                        if (!err) {
                            let userBoards = userFound.boards; 
                            userBoards.addToSet(savedBoard._id); 
                            
                            User.findByIdAndUpdate(payload._id, {boards:userBoards}).then(function(){
                                res.json(savedBoard); 
                            });
                        }
                        else{
                            res.status(400).end();
                        }
                    }); 
                    
                } else {
                    res.status(400).end();
                    console.log(err); 
                }
            });
        }).catch(console.error);

    })
    .catch(function(error) {
        res.json(error);
    });  
});

//DELETE METHOD
//Delete a specific board (project) completely 
router.delete('/:boardid', function(req, res) {
    
    var boardId = req.params.boardid;

    req.auth.then(function(payload) {

        Board.findById(boardId, function (err, board) {
            if (err || !board) {
                res.status(404).end();
            } else {

                //User checkup
                if(board.users[0] != payload._id) {
                    res.status(403).end(); 
                    return; 
                }

                let lists = board.lists;
                
                var promises = lists.map(function(listId) {
                    return new Promise(function(resolve, reject) {
            
                        List.findById(listId, function(err, listFound) {
                            if (!err) {
                                
                                let tasks = listFound.tasks; 

                                var promises2 = tasks.map(function(taskId){
                                    return new Promise(function(resolve, reject) {
                                        Task.findById(taskId, function(err, taskFound){
                                            taskFound.remove(function (err, removed) {
                                                if (!err && removed){
                                                    resolve(); 
                                                }else{
                                                    res.status(500).end(); 
                                                }
                                            }); 
                                        }); 
                                    });
                                });

                                Promise.all(promises2).then(()=>{
                                
                                    listFound.remove(function (err, removed) {
                                        if (!err && removed){
                                            resolve(); 
                                        }else{
                                            res.status(500).end(); 
                                        }
                                    });      
                                }); 

                            } else {
                                res.status(400).end();
                            }
                        });
                    });
                });
                
                Promise.all(promises)
                .then(function() {
                    board.remove(function (err, removed) {
                        if (!err) {

            

                            User.findById(payload._id, function(err, userFound){

                                let boardToRemove = removed._id;
                                let boards = userFound.boards;
                                let idIndex = boards.indexOf(boardToRemove); 
                                boards.splice(idIndex, 1);

                                User.findByIdAndUpdate(payload._id, {boards:boards}).then(data => {
                                    res.json(removed); 
                                });
                            });

                        } else {
                            res.status(400).end();
                        }
                    });
                });
            }
        });

    }).catch(function(error) {
        res.json(error);
    });
});

//Delete youself from a project 
router.delete('/user', function(req, res) {

    let boardId = req.body.boardId; 

    req.auth.then(function(payload) {
    
        Board.findById(boardId, function(err, boardFound) {
            if (!err && boardFound) {

                if(checkup(boardFound.users, payload._id)) {
                    res.status(403).end(); 
                    return; 
                }

                if (boardFound.users.length == 1){

                    Board.findById(boardId, function (err, board) {
                        if (err || !board) {
                            res.status(404).end();
                        } else {
            
                            //User checkup
                            if(board.users[0] != payload._id) {
                                res.status(403).end(); 
                                return; 
                            }
            
                            let lists = board.lists;
                            
                            var promises = lists.map(function(listId) {
                                return new Promise(function(resolve, reject) {
                        
                                    List.findById(listId, function(err, listFound) {
                                        if (!err) {
                                            
                                            let tasks = listFound.tasks; 
            
                                            var promises2 = tasks.map(function(taskId){
                                                return new Promise(function(resolve, reject) {
                                                    Task.findById(taskId, function(err, taskFound){
                                                        taskFound.remove(function (err, removed) {
                                                            if (!err && removed){
                                                                resolve(); 
                                                            }else{
                                                                res.status(500).end(); 
                                                            }
                                                        }); 
                                                    }); 
                                                });
                                            });
            
                                            Promise.all(promises2).then(()=>{
                                            
                                                listFound.remove(function (err, removed) {
                                                    if (!err && removed){
                                                        resolve(); 
                                                    }else{
                                                        res.status(500).end(); 
                                                    }
                                                });      
                                            }); 
            
                                        } else {
                                            res.status(400).end();
                                        }
                                    });
                                });
                            });
                            
                            Promise.all(promises)
                            .then(function() {
                                board.remove(function (err, removed) {
                                    if (!err) {
                                        User.findById(payload._id, function(err, userFound){

                                            let boardToRemove = removed._id;
                                            let boards = userFound.boards;
                                            let idIndex = boards.indexOf(boardToRemove); 
                                            boards.splice(idIndex, idIndex+1);
            
                                            User.findByIdAndUpdate(payload._id, {boards:boards}).then(data => {
                                                res.json(removed); 
                                            });
                                        });
            
                                    } else {
                                        res.status(400).end();
                                    }
                                });
                            });
                        }
                    });

                }else{

                    let users = boardFound.users;
                    let idIndex = users.indexOf(payload._id); 
                    users.splice(idIndex, idIndex+1);

                    Board.findByIdAndUpdate(boardId, {users:users}).then(data1 => {
                        User.findById(payload._id, function(err, userFound){

                            let boardToRemove = boardId;
                            let boards = userFound.boards;
                            let idIndex = boards.indexOf(boardToRemove); 
                            boards.splice(idIndex, 1);

                            User.findByIdAndUpdate(payload._id, {boards:boards}).then(data2 => {
                                res.json(data1); 
                            });
                        });

                    });
                }

                
            } else {
                res.status(400).end();  
            }
        });
    }).catch(function(error) {
        res.json(error);
    });
});


module.exports = router;
