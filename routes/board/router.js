const express = require('express');
const router = express.Router();


const mongoose = require('mongoose');
require('../../models');
const Board = mongoose.model('Board');
const List = mongoose.model('List');

//GET METHOD
//Get the board with all element or refresh the board completely
//Authorization
router.get('/:boardid', function(req, res) {
    
    Board.findById(req.params.boardid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else if (req.accepts("html")) {
            res.render("userTemplate", {result: found});
        } else if (req.accepts("json")) {
            res.json(found);
        }
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

//PUT METHOD
//Modify the name of the board object
router.put('/:boardid/name', function(req, res){

    var board = {name: req.body.name}
    
    Board.findByIdAndUpdate(req.params.boardid, board).then(data => {
        res.json(data); 
    }); 
        
});

//POST METHOD 
//Creat a new board (project)
//Need an authorization, create a new board with the user who create it as admin, 
//then he can invite other users
router.post('/', function(req, res) {

    //The array is initialized with the current user who create it
    let boardId = req.body.userId;
    let arrayUser = [boardId];
    let arrayList = [];
    let arrayListId = [];

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
        
        console.log('all dropped)'); 
        
        const board = new Board({
            name : req.body.name, 
            users : arrayUser,
            lists : arrayListId
        })
        
        console.log(board); 
        
        board.save(function(err, saved) {
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
    }).catch(console.error);
});

//Put a new existing user inside the project
router.post('/:boardid/:userid', function (req,res){
    
    var board = {}

    Board.findById(req.params.boardid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else {
            board = found;
            board.users.push(req.params.userid);

            Board.findByIdAndUpdate(req.params.boardid, board).then(data => {
                res.json(data); 
            }); 
        }
    });

}); 

//PUT METHOD 
//Update an existing user inside the project (rights, status, role)
router.put('/:boardid/:userid', function (req,res){

    //TODO

});

//DELETE METHOD
//Delete a specific board completely 
router.delete('/:boardid', function(req, res) {
    
    var boardId = req.params.boardid;

    Board.findById(boardId, function (err, found) {
        if (err || !found) {
            res.status(404).end();
        } else {
            found.remove(function (err, removed) {
                if (!err) {
                    if (req.accepts('html')) {
                        res.status(200).end();
                    } else {
                        res.status(200).end();
                    }
                } else {
                    res.status(400).end();
                }
            });
        }
    });


});

//Delete a specific user from a specific board 
router.delete('/:boardid/:userid', function(req, res) {
    

    Board.findById(req.params.boardid, function(err, found) {
        if (!found) {
            res.status(404).end();
        } else {

            let users = found.users;
            let idIndex = users.indexOf(req.params.userid); 
            if (idIndex == -1){
               
            }else{
                users.splice(idIndex, idIndex+1);

                Board.findByIdAndUpdate(req.params.boardid, {users:users}).then(data => {
                    res.json(data); 
                });

            } 
        }
    });
});


module.exports = router;
