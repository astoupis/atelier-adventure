const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
require('../../models');

const Task = mongoose.model('Task');
const List = mongoose.model('List');
const Board = mongoose.model('Board');

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
//Modify the name and the description of a specific task
router.put('/:taskid', function(req, res){

});

//Add a user to assignedUser for a specific task
router.put('/:taskid/:userid/assigned', function(req, res){
    //TODO
});

//Delete a user from assignedUser for a specific task
router.put('/:taskid/:userid/unassigned', function(req, res){
    //TODO
});

//Move a task into another existing list (Drag and Drop)
router.put('/:taskid/:listid', function(req, res){
    
    let boardId = req.body.boardId;
    let listId = req.params.listid; 
    let taskId = req.params.taskId;
    
    Board.findById(boardId, function(err, boardFound){

        if (!err && boardFound){
            
            List.findById(listId, function(err, listFound){
                if (!err && listFound){
                    //create the task
                    task.save(function(err, saved) {
                        if (!err && saved) { 

                            listFound.tasks.push(saved._id);
                            let tasks = listFound.tasks;
                            
                            List.findByIdAndUpdate(listId, {tasks:tasks}).then(data => {
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
        }else{
            res.status(400).end();
        }
    }); 

    
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

    Board.findById(boardId, function(err, found){

        if (!err && found){
            
            List.findById(listId, function(err, listFounded){
                if (!err && listFounded){
                    //Find the task
                    Task.findById(taskId, function(err, taskFounded) {
                        if (!err && taskFounded) { 
                            
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
}); 

module.exports = router;
