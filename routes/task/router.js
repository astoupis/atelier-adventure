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
//Get the task by its id
router.get('/:taskid/:listid/:boardid', function(req, res) {

    let boardId = req.params.boardid;
    let listId = req.params.listid; 
    let taskId = req.params.taskid;
    let aPayload; 
    
    req.auth.then(function(payload) {
        aPayload = payload;        
        /* -- GET THE REQUIRED TASK -- */
        return Task.findById(taskId).exec();
    })
    .then(function(task) {
        /* -- CHECK IF THE USER CAN SEE THIS TASK -- */
        Board.findById(boardId, function(err, boardFound){ 
            if (!err && boardFound){
                List.findById(listId, function(err, listFound){
                    
                    if (!err && listFound){
                        if(checkup(boardFound.users, aPayload._id)) {
                            res.status(403).end(); 
                            return; 
                        }

                        if(checkup(boardFound.lists, listId)) {
                            res.status(403).end(); 
                            return; 
                        }

                        if(checkup(listFound.tasks, taskId)) {
                            res.status(403).end(); 
                            return; 
                        }
                        
                        res.json(task);

                    }else{
                        res.status(400).end();
                    }
                })
            }else{
                res.status(400).end(); 
            } 
        });

        /* -- RETURN THE TASK -- */
        
    })
    .catch(function(error) {
        if(error instanceof Error.DocumentNotFoundError) {
            res.status(404);
        } else {
            res.status(403);
        }
        res.json(error);
    });
});


//GET METHOD
//Get or refresh all the task in the correct columns inside a project
router.get('/', function(req, res) {
    return; 
});

//PUT METHOD
//Move a task into another existing list (Drag and Drop)
router.put('/list', function(req, res){
    
    let boardId = req.body.boardId;
    let fromListId = req.body.fromListId; 
    let toListId = req.body.toListId; 
    let taskId = req.body.taskId;
    let desiredPosition = req.body.desiredPosition;

    req.auth.then(function(payload){
    
        Board.findById(boardId, function(err, boardFound){

            if (!err && boardFound){

                if(checkup(boardFound.users, payload._id)) {
                    res.status(403).end(); 
                    return; 
                }

                if(checkup(boardFound.lists, fromListId)) {
                    res.status(403).end(); 
                    return; 
                }

                if(checkup(boardFound.lists, toListId)) {
                    res.status(403).end(); 
                    return; 
                }
                
                List.findById(fromListId, function(err, listFound1){
                    
                    if (!err && listFound1){

                        if(checkup(listFound1.tasks, taskId)) {
                            res.status(403).end(); 
                            return; 
                        }
                        
                        List.findById(toListId, function(err, listFound2){

                            if (!err && listFound2){

                                Task.findById(taskId, function(err, taskFound){
                                    
                                    if (!err && taskFound){

                                        let fromListTasks = listFound1.tasks;
                                        let idIndex = fromListTasks.indexOf(taskId);
                                        fromListTasks.splice(idIndex, 1);

                                        List.findByIdAndUpdate(fromListId, {tasks:fromListTasks}, function(err, updated1){
                                            if (!err && updated1){
                                                
                                                let toListTasks = listFound2.tasks;
                                                console.log(toListTasks);
                                                console.log(desiredPosition);
                                                if (checkup(toListTasks, taskId)) {
                                                    toListTasks.splice(desiredPosition, 0, taskId);
                                                }

                                                List.findByIdAndUpdate(toListId, {tasks:toListTasks}, function(err, updated2){
                                                    
                                                    if (!err && updated2){
                                                        res.json(updated2); 
                                                    }else{
                                                        res.status(500).end();
                                                    }
                                                });

                                            }else{
                                                res.status(500).end();
                                            }

                                        }); 


                                    }else{
                                        res.status(400).end(); 
                                    }

                                });
                            }
                        });

                    }else{
                        console.log('here2')
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

//Modify the name and the description of a specific task
router.put('/:taskid', function(req, res){
    return; 
});

//POST METHOD 
//Creat a new task for an existing project
router.post('/', function(req, res) {

    let boardId = req.body.boardId;
    let listId = req.body.listId;
    
    let taskName = req.body.taskName; 
    let taskDescription = req.body.taskDescription;
    //let taskDueData = req.body.taskDueDate;
    //let taskAssignedUsers = req.body.taskAssigndeUsers;

    const task = new Task({
        name: taskName ,
        description: taskDescription
        //dueDate: taskDueData,
        //assignedUsers = taskAssignedUsers
    })

    req.auth.then(function(payload){

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
                        
                        task.save(function(err, saved) {
                            if (!err && saved) { 

                                listFound.tasks.push(saved._id);
                                let tasks = listFound.tasks;
                                
                                List.findByIdAndUpdate(listId, {tasks:tasks}).then(data => {
                                    res.json(saved); 
                                }); 
                                
                            } else {
                                res.status(400).end();
                            }
                        });

                    }else{
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
//Delete a specific task in an existing project
router.delete('/', function(req, res) {


    let boardId = req.body.boardId;
    let listId = req.body.listId;
    let taskId = req.body.taskId; 

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
                
                List.findById(listId, function(err, listFounded){
                    if (!err && listFounded){

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

                        Task.findById(taskId, function(err, taskFounded) {
                            if (!err && taskFounded) { 

                                let forbidden = true;
                                for(let i = 0; i < listFounded.tasks.length; i++){
                                    if(listFounded.tasks[i].toString() === taskId) {
                                        forbidden = false;
                                        break;
                                    }
                                }
                        
                                if(forbidden) {
                                    res.status(403).end(); 
                                    return; 
                                }
                                
                                let tasks = listFounded.tasks;
                                let idIndex = tasks.indexOf(taskId);
                                tasks.splice(idIndex, idIndex+1);

                                //Delete the task id
                                List.findByIdAndUpdate(listId, {tasks:tasks}).then(() => {

                                    taskFounded.remove(function (err, removed) {
                                        if (!err) {
                                        res.json(removed);  
                                        } else {
                                            res.status(400).end();
                                        }
                                    });
                                });  
                            } else {
                                res.status(400).end();
                            }
                        });
                    }else{
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


module.exports = router;
