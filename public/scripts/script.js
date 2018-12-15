//=============================================================
// LOGIN PAGE FUNCTIONS
//=============================================================


// Function addListeners
// which adds the listeners for various buttons
// such as the checkbox button
function addListeners () {
    
    //show passaword for login
    document.getElementById("log-psw-checkbox").addEventListener('click', function(){
        let pswText = document.getElementById("log-psw-box");
        if (pswText.type === "password") {
            pswText.type = "text";
        } else {
            pswText.type = "password";
        }
    });

    //show password for register 
    document.getElementById("reg-psw-checkbox").addEventListener('click', function(){
        let pswText = document.getElementById("reg-psw-box");
        if (pswText.type === "password") {
            pswText.type = "text";
        } else {
            pswText.type = "password";
        }
    });
    
    //open registration popup window 
    document.getElementById('signup-btn').addEventListener('click', function(){
        document.querySelector('.pp-register').style.display = 'flex';
    });

    //close registration popup window when clicking on closing btn 
    document.getElementById("register-close").addEventListener('click', function(){
        document.querySelector('.pp-register').style.display = 'none';
    });

    //close registration popup window when clicking outside modal
    window.onclick = function(event) {
        let modal = document.querySelector(".pp-register");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    } 

    //login post request   
    document.getElementById('login-btn').addEventListener('click', function(){
        doJSONRequest('POST', "/login", {'Content-Type': 'application/json'},
        {username: document.getElementById("log-usr-box").value, 
        password: document.getElementById("log-psw-box").value})
        .then((data) =>{
            console.log(data);
            if (data.errorMessage){
                document.getElementById('error').innerHTML = data.errorMessage;
            }
            else{
                window.location.href = "/";
            }
        })
    });


    //register user request
    document.getElementById('register-btn').addEventListener('click', function(){
        doJSONRequest('POST', "/register", {'Content-Type': 'application/json'},
        {firstname: document.getElementById("reg-fnm-box").value, 
        lastname: document.getElementById("reg-lnm-box").value,
        email: document.getElementById("reg-eml-box").value , 
        username: document.getElementById("reg-usr-box").value, 
        password: document.getElementById("reg-psw-box").value})
        .then((data)=>{
            if (data.message){
                //create popup for mistake 
                document.getElementById('error').innerHTML = data.message;
            }
            document.querySelector(".pp-register").style.display = "none";
        })
        .catch((error)=>{
            //
        });
    });
}


//=============================================================
// BOARD PAGE FUNCTIONS
//=============================================================
let dragLock = "";
// initialization of id
let id = 0;

// ID function
function newId () {
    return id++;
}

function addListeners2 () {
    
    //assign the id of the board to variable boardId
    let boardId = document.querySelector("main").id;
    //call function to renser user avatar on board 
    renderAvatar(boardId);

    //go back to profile button 
    document.getElementById("go-back-btn").addEventListener('click', function(){
        userGoBack();
    });

    //Search event listener
    //add event listener (on keyup) to call function --> search
    document.getElementById('invite-box').addEventListener('keyup', ()=>{
        search(document.getElementById('invite-box').value);
    });

    //open invitation popup window 
    document.getElementById('invite-btn').addEventListener('click', ()=>{
        document.querySelector('.pp-register').style.display = 'flex';
    })

    //close invitation popup window when clicking on X
    document.getElementById("register-close").addEventListener('click', function(){
        document.querySelector('.pp-register').style.display = 'none';
    }.bind(this));

    // close invitation popup window when clicking away
    window.onclick = function(event) {
        let modal = document.querySelector(".pp-register");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }  

    //Invite event listener
    //add result of search when clicking invite
    document.getElementById('add-btn').addEventListener('click', ()=>{
        userAdd();
    });
    
    // Render lists
    boardGetLists(document.querySelector("main").id);

    let title = document.getElementById("project-title");
    title.contentEditable = true;
    title.addEventListener('blur', (event) => {
        let actualTitle = title.innerHTML;
        let boardId = document.querySelector("main").id;
        doJSONRequest('PUT', "/board/name", {'Content-Type': 'application/json'}, 
        {boardName: actualTitle,
        boardId: boardId
        })
    });

    // adds functionality to the add list button
    let addListBtn = document.getElementById("addList-btn");
    addListBtn.addEventListener('click', () => {
        let parent = addListBtn.parentNode;
        // create column
        let div = document.createElement('div');
        div.className = "droptarget movable-column";
        div.draggable = true;
        //addListenersCol(div);

        // create title of column
        let h1 = document.createElement('h1');
        h1.className = "state-head";
        h1.innerHTML = "New List (In Progress)";
        h1.contentEditable = true;
        div.appendChild(h1);

        // create new task button inside column
        newTaskButton(div);

        let hiddenDiv = document.createElement('div');
        hiddenDiv.className = "hidden-div";
        
        

        let boardId = document.querySelector("main").id;
        doJSONRequest('POST', "/list", {'Content-Type': 'application/json'},
        {boardId: boardId,
        listName: "New List"})
        .then((data) => {
            console.log(data);
            let len = data.lists.length;
            div.id = data.lists[len - 1];
            h1.innerHTML = "New List";
            boardGetLists(boardId);
            h1.addEventListener('blur', (element) => {
                element = element.srcElement;
                let listName = element.innerHTML;
                let listId = element.parentNode.id;
                let boardId = document.querySelector(".droptarget-column").id;
                doJSONRequest('PUT', "/list", {'Content-Type': 'application/json'}, 
                {boardId: boardId,
                listId: listId,
                listName: listName
                })
                .catch((error) => {
                    throw error;
                });
            });
        })
        .catch((error) => {
            console.log(error);
        });
    });

    // find all the columns and for each one of them add the new Task button
    let columnArray = document.querySelectorAll(".droptarget");
    columnArray.forEach((element) => {
        let hiddenDiv = document.createElement('div');
        hiddenDiv.className = "hidden-div";

        element.after(hiddenDiv);
        newTaskButton(element);
    });

    let taskArray = document.querySelectorAll("h1.sticker");
    taskArray.forEach((element) => {
        element.contentEditable = true;
    });

    let createdTasks = document.querySelectorAll(".movable-task");
    createdTasks.forEach((element) => {
        let hiddenTaskDiv = document.createElement('div');
        hiddenTaskDiv.className = "hidden-task";
        element.after(hiddenTaskDiv);
    });
}


// function for creating the button for new tasks
function newTaskButton (div) {
    // create new task button
    let outerDiv = document.createElement("div");
    outerDiv.style.textAlign = "center";
    // create the button
    let input = document.createElement('input');
    input.value = "Create new task";
    input.type = "button";
    input.className = "newTask-btn";
    input.name = "newTask-btn";
    input.style.textAlign = "center"
    // append button to div
    outerDiv.appendChild(input);
    div.appendChild(outerDiv);
    // add listener to the button
    input.addEventListener('click', (event) => {
        let target = event.target;
        let taskDiv = newTask();

        let descDiv = document.createElement('div');
        let descLabel = document.createElement('label');
        descDiv.className = "stick-desc";
        descLabel.innerHTML = " Description: ";
        let descPara = document.createElement('p');
        descPara.innerHTML = "New Description";

        let dateDiv = document.createElement('div');
        let dateLabel = document.createElement('label');
        dateDiv.className = "stick-desc";
        dateLabel.innerHTML = " Due date: ";
        let datePara = document.createElement('p');
        datePara.innerHTML = "sample due date";

        
        descDiv.appendChild(descLabel);
        descDiv.appendChild(descPara);

        dateDiv.appendChild(dateLabel);
        dateDiv.appendChild(datePara);

        taskDiv.appendChild(descDiv);
        taskDiv.appendChild(dateDiv);

        let hiddenTaskDiv = document.createElement('div');
        hiddenTaskDiv.className = "hidden-task";

        let taskName = "New Task";
        let taskDesc = taskDiv.firstChild.nextElementSibling.firstChild.nextElementSibling.innerHTML;
        let listId = target.parentNode.parentNode.id;
        let boardId = document.querySelector("main").id;
        doJSONRequest('POST', "/task", {'Content-Type': 'application/json'}, 
            {boardId: boardId,
            listId: listId,
            taskName: taskName,
            taskDescription: taskDesc
            }
        )
        .then((data) => {
            //taskDiv.id = data._id;
            //taskDiv.firstChild.innerHTML = "New Task";
            boardGetLists(boardId);
            
        })
        .catch((error) => {
            console.log(error);
            target.parentNode.before(taskDiv);
            taskDiv.after(hiddenTaskDiv);
        });
    });    
} 

// function for creating a new task
function newTask () {
    // create taskdiv
    let taskDiv = document.createElement('div');
    // make it draggable
    taskDiv.draggable = true;
    // give it an id
    taskDiv.id = "task" + newId();
    // class
    taskDiv.className = "sticker movable-task";
    taskDiv.style.backgroundColor = getColor();
    // create title of the task
    let taskh1 = document.createElement('h1');
    // class
    taskh1.className = "sticker";
    // default title
    taskh1.innerHTML = "New Task (In Progress)";
    // make it editable
    taskh1.contentEditable = true;
    taskDiv.appendChild(taskh1);

    return taskDiv;
}

// generate a random color between four colors
function getColor () {
    let random = Math.floor(Math.random() * 4) + 1;
    if (random === 1) {
        return "forestgreen";
    } else if (random === 2) {
        return "coral";
    } else if (random === 3) {
        return "lightseagreen";
    } else {
        return "deeppink"
    }
}

function setColor (id) {
    let color = getColor();
    let element = document.getElementById(id);
    element.style.backgroundColor = color;
}

// Event listener attached to the window (whole broswer) 
// which detects when a draggable element is dragged
document.addEventListener("dragstart", function(event) {
    // we attach the id of the element inside a transfer object 
    // to get it again at the drop event (later event)
    event.dataTransfer.setData('text', event.target.id); 
    dragLock = event.target;
    // change opacity of the dragged element
    event.target.style.opacity = "0.4";
    document.body.style.cursor = "grab";
});

// Event listener attached to the window (whole browser)
// which detects when an element is simply dragged and we keep the mouse on the element
document.addEventListener("drag", function(event) {
    // prevent default
    event.preventDefault();
    document.body.style.cursor = "grabbing";
    
});

// Event listener attached to the window (whole browser)
// which detects when an element is released from a drag event
// doesn't matter if the element is in a dropzone
document.addEventListener("dragend", function(event) {
    // change opacity of the dragged element
    event.target.style.opacity = "1";
    dragLock = "";
    document.body.style.cursor = "default";
});

// Event listener attached to the window (whole browser)
// which detects when a dragged element enters a dropzone
document.addEventListener("dragenter", function(event) {
    event.preventDefault();
    if ((event.target.className) && (event.target.className === "droptarget movable-column")) {
        if(dragLock && dragLock.className && dragLock.className === "sticker movable-task"){
            event.target.style.border = "3px solid white";
            
        }        
    }
    if ((event.target.className) && (event.target.className === "hidden-div")) {
        if(dragLock && dragLock.className && dragLock.className === "droptarget movable-column"){
            //event.target.style.border = "20px dotted red";
            event.target.style.backgroundColor = "rgb(49, 49, 51)";
            event.target.style.width = "40%";
            event.target.style.minWidth = "20%";
        }
    }
    if ((event.target.className) && (event.target.className === "hidden-task")) {
        if(dragLock && dragLock.className && dragLock.className === "sticker movable-task"){
            event.target.style.backgroundColor = "rgb(49, 49, 51)";
            event.target.style.minHeight = "15vh";

        }
    }

});

// Event listener attached to the window (whole browser)
// which detects when the dragged object is over a dropzone
document.addEventListener("dragover", function(event) {
    // prevent default
    event.preventDefault();
});

// Event listener attached to the window (whole browser)
// which detects when the dragged object leaves a dropzone
document.addEventListener("dragleave", function(event) {
    event.preventDefault;
    if ((event.target.className) && (event.target.className === "droptarget movable-column")) {
        if(dragLock && dragLock.className && dragLock.className === "sticker movable-task"){
            event.target.style.border = "";
        }       
    }
    if ((event.target.className) && (event.target.className === "hidden-div")) {
        if (dragLock.className && dragLock.className === "droptarget movable-column"){
            event.target.style.backgroundColor = "#1C1C1E";
            event.target.style.width = "5px";
            event.target.style.minWidth = "5px";
        }
    }
    if ((event.target.className) && (event.target.className === "hidden-task")) {
        if(dragLock && dragLock.className && dragLock.className === "sticker movable-task"){
            event.target.style.backgroundColor = "#1C1C1E";
            event.target.style.minHeight = "10px";
        }
    }
});

// Event listener attached to the window (whole browser)
// which detects when the dragged object is dropped
document.addEventListener("drop", function(event) {
    // prevent default
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    if ((event.target.className) && (event.target.className === "droptarget movable-column")) {

        if (dragLock.className && dragLock.className === "sticker movable-task"){
            let hiddenDiv = dragLock.nextElementSibling;
            let boardId = document.querySelector("main").id;
            let taskId = dragLock.id;
            let listIdOld = dragLock.parentNode.id;
            let listId = event.target.id;
            let desiredPosition = document.getElementById(listId).querySelectorAll(".hidden-task").length - 1;

            event.target.lastElementChild.before(dragLock);
            dragLock.after(hiddenDiv);

            if(typeof desiredPosition === 'number' && desiredPosition >= 0) {
                // SENDING THE INFO TO THE SERVER
                let queryObject = {
                    boardId: boardId,
                    fromListId: listIdOld,
                    toListId: listId,
                    taskId: taskId,
                    desiredPosition: desiredPosition
                }
                console.log(queryObject);
                doJSONRequest("PUT", "/task/list", {}, queryObject)
                .catch(function() {
                    prevSiblOld.after(dragLock);
                    dragLock.after(hiddenDiv);
                });
            }
            

            event.target.style.border = "";
        }
        
    }
    if ((event.target.className) && (event.target.className === "hidden-div")) {
        if (dragLock.className && dragLock.className === "droptarget movable-column"){
            let hiddenDiv = dragLock.nextElementSibling;
            let destinationHiddenDiv = event.target;
            event.target.after(dragLock);
            dragLock.after(hiddenDiv);

            let desiredPosition = (() => {
                let array = document.querySelectorAll(".hidden-div");
                
                for(let i = 0; i < array.length; i++) {
                    if(array[i] === destinationHiddenDiv && destinationHiddenDiv !== hiddenDiv) {
                        return i;
                    }
                }
                return -1;
            })();
            if(typeof desiredPosition === 'number' && desiredPosition >= 0) {
                let queryObject = {
                    listId: dragLock.id,
                    boardId: document.querySelector("main").id,
                    desiredPosition: desiredPosition
                }
    
                doJSONRequest("PUT", "/board/list-move", {}, queryObject)
                .catch(function(error) {
                    boardGetLists(queryObject.boardId);
                });
            }

            

            event.target.style.backgroundColor = "#1C1C1E";
            event.target.style.width = "5px";
            event.target.style.minWidth = "5px";
        }
    }

    if ((event.target.className) && (event.target.className === "hidden-task")) {
        if(dragLock && dragLock.className && dragLock.className === "sticker movable-task") {
            // GATHERING DRAG-N-DROP INFO
            let hiddenDiv = dragLock.nextElementSibling;
            let boardId = document.querySelector("main").id;
            let taskId = dragLock.id;
            let listIdOld = dragLock.parentNode.id;
            let listId = event.target.parentNode.id;
            let destinationHiddenDiv = event.target;


            let desiredPosition = (() => {
                let array = document.getElementById(listId).querySelectorAll(".hidden-task");
                
                for(let i = 0; i < array.length; i++) {
                    if(array[i] === destinationHiddenDiv && destinationHiddenDiv !== hiddenDiv) {
                        return i;
                    }
                }
                return -1;
            })();


            // DOING REQUEST
            if(typeof desiredPosition === 'number' && desiredPosition >= 0) {
                // BACKUP, IN CASE OF FAILURE
                let prevSiblOld = dragLock.previousSibling;

                // PERFORMING VISUAL DRAG-N-DROP
                event.target.after(dragLock);
                dragLock.after(hiddenDiv);

                // SENDING THE INFO TO THE SERVER
                let queryObject = {
                    boardId: boardId,
                    fromListId: listIdOld,
                    toListId: listId,
                    taskId: taskId,
                    desiredPosition: desiredPosition
                }
                doJSONRequest("PUT", "/task/list", {}, queryObject)
                // CANCELING DRAG-N-DROP, IF IT FAILS
                .catch(function(error) {
                    prevSiblOld.after(dragLock);
                    dragLock.after(hiddenDiv);
                });
            }
            // AFTERCLEANUP
            event.target.style.backgroundColor = "#1C1C1E";
            event.target.style.minHeight = "10px";
        }
    }
    
    dragLock = "";
});

// onclick function in board page
// function for showing the user description
function userDesc(data){
    // track the popup element
    let popup = document.getElementById(data);
    // make it visible
    popup.classList.toggle("show");
}

// onclick function triggered when clicking the task
// open/show the popup page for modifications 
function showModPP(id){
    document.getElementById(id).querySelector('.pp-mod-task').style.display = 'flex';
}
// onclick function triggered when clicking on X button of the mod-task popup
function closeModPP(id){
    document.getElementById(id).querySelector('.pp-mod-task').style.display = 'none';
}

//=============================================================
// USER PAGE FUNCTIONS
//=============================================================
function addListeners3() {
    //show passaword for modification
    document.getElementById("mod-psw-checkbox").addEventListener('click', function(){
        let oldPswText = document.getElementById("old-psw-box");
        let newPswText = document.getElementById("new-psw-box");
        if (oldPswText.type === "password" || newPswText.type == "password") {
            oldPswText.type = "text";
            newPswText.type = "text";
        } else {
            oldPswText.type = "password";
            newPswText.type = "password";
        }
    });

    //open modification popup window 
    document.getElementById('modity-btn').addEventListener('click', function(){
        document.querySelector('.pp-register').style.display = 'flex';
    });

    //close modification popup window when clicking on closing btn 
    document.getElementById("register-close").addEventListener('click', function(){
        document.querySelector('.pp-register').style.display = 'none';
    });

    //close modification popup window when clicking outside modal
    window.onclick = function(event) {
        let modal = document.querySelector(".pp-register");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    } 

    //saving modifications
    document.getElementById("save-mod-btn").addEventListener('click', function(){
        doJSONRequest('PUT', "/user", {'Content-Type': 'application/json'},
        {firstname: document.getElementById("mod-fnm-box").value, 
        lastname: document.getElementById("mod-lnm-box").value,
        email: document.getElementById("mod-eml-box").value , 
        username: document.getElementById("mod-usr-box").value, 
        password: document.getElementById("new-psw-box").value})
        .then((data)=>{
            if(data.message){
                document.getElementById('error').innerHTML = data.message;
            }
            document.querySelector(".pp-register").style.display = "none";
            userUpdate();  
        })
        .catch((error)=>{
            console.log(error);
        });
    });

    // Logout 
    document.getElementById("logout-btn").addEventListener('click', function(){
        userLogout();
    });

    // Create new board when clicking on "new board button"
    document.getElementById("new-board-btn").addEventListener('click', function(){
        boardCreate();
    });

    //get user + get board array 
    doJSONRequest('GET', '/user', {}, undefined)
    .then((user)=>{
        user.boards.forEach((element)=>{
            getBoardPrev(element);
        });

        // document.getElementById('posted-boards').addEventListener('click', function(e) {
        //     const board_id = e.target.dataset.board || e.target.parentNode.dataset.board;
        //     if(board_id) {
        //         //window.location.href = "/board/" + board_id;
        //     }                        
        // });
    });

    //update the user onload();
    userUpdate();
}

// onclick functions for board preview (userpage) functionalities (redirect, delete, leave) 
//redirect 
function boardRedirect(id){
    window.location.href = "/board/" + id;
}
//delete
function deleteBoard(id){
    doFetchRequest("DELETE", "/board/" + id, {}, null)
    .then((board) => {
        boardPrevUpdate();
    })
    .catch((err) => {
        console.log(err);
    });
}
//leave 
function leaveBoard(id){
    doFetchRequest("DELETE", "/board/user/" + id, {}, null)
    .then((data) => {
        boardPrevUpdate();
    })
    .catch((err) => {
        console.log(err);
    });
}

// onclick function for board functionalities (delete-list, delete-task) 
// Delete list
function listDelete(listid){
    let boardid = document.querySelector("main").id;
    doJSONRequest("DELETE", "/list/" + boardid + "/" + listid, {}, null)
    .then((board) => {
        boardGetLists(board._id, true);
    })
    .catch((err) => {
        console.log(err);
    })
}

// Modify task
function taskModify(taskid){
    console.log("this is task: " + taskid)
    let listid = document.getElementById(taskid).parentNode.id;
    let boardid = document.querySelector("main").id;
    let date = new Date(document.getElementById("task-date-box").value);
    console.log(date);
    return fetch("/task/" + taskid, {
        method: "PUT", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            boardId: boardid,
            listId: listid,
            taskName: document.getElementById("task-name-box").value,
            taskDescription: document.getElementById("task-desc-box").value,
            taskDueDate: date
        }), // body data type must match "Content-Type" header
    }).then((data)=>{
        console.log(data);

    })
    // doFetchRequest("PUT", "/task/" +  boardid + "/" + listid + "/" + taskid, 
    //     {'Content-Type': 'application/json'}, 
    //     {   
    //         taskName: document.getElementById("task-name-box").value,
    //         taskDescription: document.getElementById("task-desc-box").value,
    //         taskDueDate: "today"
    //     }
    // )
    .then((data) => {
        //need to re-render the list or board
        closeModPP(taskid);
    })
    .catch((err) => {
        console.log(err);
    })
};

// Delete task
function taskDelete(taskid){
    let listid = document.getElementById(taskid).parentNode.id;
    let boardid = document.querySelector("main").id;
    console.log(taskid);
    doJSONRequest("DELETE", "/task/" +  boardid + "/" + listid + "/" + taskid, {}, null)
    .then((data) => {
        console.log(data);
        //need to re-render the list or board
        //need to close the popup
        closeModPP(taskid);
        boardGetLists(boardid);
    })
    .catch((err) => {
        console.log(err);
    })
};

