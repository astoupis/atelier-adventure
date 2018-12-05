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
    });


    // //register user request
    document.getElementById('register-btn').addEventListener('click', function(){
        doJSONRequest('POST', "/register", {'Content-Type': 'application/json'},
        {firstname: document.getElementById("reg-fnm-box").value, 
        lastname: document.getElementById("reg-lnm-box").value,
        email: document.getElementById("reg-eml-box").value , 
        username: document.getElementById("reg-usr-box").value, 
        password: document.getElementById("reg-psw-box").value})
        .then((data)=>{
            document.querySelector(".pp-register").style.display = "none";
        })
        .catch((error)=>{
            console.log(error);
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
let iD = 0;
function newID () {
    return iD++;
}

function addListeners2 () {
    let inviteBtn = document.getElementById("invite-btn");
    inviteBtn.addEventListener('click', () => {
        document.querySelector('.pp-register').style.display = 'flex';
        return;
        // TODO
        // make popup
        // add the username in the URL to search for him by getting it from the fields of the pop-up
        // doJSONRequest('GET', "/user/search/", {'Content-Type': 'application/json'}, undefined);
    });

    //close registration popup window
    document.getElementById("register-close").addEventListener('click', function(){
        document.querySelector('.pp-register').style.display = 'none';
    }.bind(this));


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
        h1.innerHTML = "New List";
        h1.contentEditable = true;
        div.appendChild(h1);

        // create new task button inside column
        newTaskButton(div);

        parent.before(div);
    });

    // find all the columns and for each one of them add the new Task button
    let columnArray = document.querySelectorAll(".droptarget");
    columnArray.forEach((element) => {
        newTaskButton(element);
    });

    let taskArray = document.querySelectorAll("h1.sticker");
    taskArray.forEach((element) => {
        element.contentEditable = true;
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        let modal = document.querySelector(".pp-register");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    
    let movableColArr = document.querySelectorAll(".movable-column");
    let movableTaskArr = document.querySelectorAll(".movable-task");

    // movableTaskArr.forEach((element) => {
    //     addListenersTask(element);
    // });

    // movableColArr.forEach((element) => {
    //     addListenersCol(element); 
    // });
    
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
        target.parentNode.before(taskDiv);
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
    taskh1.innerHTML = "New Task";
    // make it editable
    taskh1.contentEditable = true;
    taskDiv.appendChild(taskh1);
    //addListenersTask(taskDiv);

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

// Event listener attached to the window (whole broswer) 
// which detects when a draggable element is dragged
document.addEventListener("dragstart", function(event) {
    // we attach the id of the element inside a transfer object 
    // to get it again at the drop event (later event)
    event.dataTransfer.setData('text', event.target.id); 
    dragLock = event.target;
    console.log(dragLock);
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
    if ((event.target.className) &&
        (event.target.className === "droptarget movable-column")) {
            if(dragLock && dragLock.className && dragLock.className === "sticker movable-task"){
                event.target.style.border = "3px dotted red";
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
    if ((event.target.className) &&
    (event.target.className === "droptarget movable-column")) {
        if(dragLock && dragLock.className && dragLock.className === "sticker movable-task"){
            event.target.style.border = "";
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
            event.target.lastElementChild.before(dragLock);
        }

        if (dragLock.className && dragLock.className === "droptarget movable-column"){
            event.target.after(dragLock);
            console.log(event.target);
        }
        
    }

    // if ((event.target.className) && (event.target.className === "droptarget-column")){
    //     if (dragLock.className && dragLock.className === "droptarget movable-column"){
    //         console.log(event.target);
    //         console.log("hello")
    //         //event.target.lastElementChild.before(document.getElementById(data));
    //     }
    // }


    event.target.style.border = "";
    dragLock = "";
});

// function for showing the user description
function userDesc(data){
    // track the popup element
    let popup = document.getElementById(data);
    // console.log(popup);
    // make it visible
    popup.classList.toggle("show");
}


// add listeners to a task
function addListenersTask (element) {
    element.addEventListener('drag', (event) => {
        event.preventDefault();
    });
    
    element.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
        event.target.style.opacity = "0.4";
        dragLock = element;
    });

    element.addEventListener('dragend', (event) => {
        event.target.style.opacity = "1";
        dragLock = "";
    });
}

// add listeners to a column
function addListenersCol (element) {
    element.addEventListener('drop', (event) => {
        // prevent default
        event.preventDefault();
        let data = event.dataTransfer.getData("text");

        if ((event.target.className) && (document.getElementById(data)) &&
        (event.target.className === "droptarget movable-column")) {

            if (document.getElementById(data).className === "sticker movable-task"){
                event.target.lastElementChild.before(document.getElementById(data));
            }

            if (document.getElementById(data).className === "droptarget movable-column"){
                console.log(event.target);
                //event.target.lastElementChild.before(document.getElementById(data));
            }
            
        }


        event.target.style.border = "";
        dragLock = "";
    });

    element.addEventListener('dragenter', (event) => {
        event.preventDefault();
        if ((event.target.className) &&
        (event.target.className === "droptarget movable-column")) {
            if(dragLock && dragLock.className && dragLock.className === "sticker movable-task"){
                event.target.style.border = "3px dotted red";
                return;
            }         
        }
        if ((event.target.className) &&
        (event.target.className === "droptarget-column")) {
            if(dragLock && dragLock.className && dragLock.className === "droptarget movable-column"){
                event.target.style.border = "3px dotted red";
                return;
            } 
        }
        
    });

    element.addEventListener('dragleave', (event) => {
        event.preventDefault;
        if ((event.target.className) &&
        (event.target.className === "droptarget movable-column")) {
            // change border
            event.target.style.border = "";        
        }
    });

    element.addEventListener('dragover', (event) =>{
        event.preventDefault();
    });
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
            newPswText.type = "type";
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
        // get user get password
        // if (document.getElementById("old-psw-box").value == user.password){ //continue
        //transform image into string toDataURL() --> ??
        let image = (document.getElementById("importAvatar").value);
        console.log(image);
        //check if they have changed or not 
        //if not leave standard 
        doJSONRequest('PUT', "/user/:userid", {'Content-Type': 'application/json'},
        {firstname: document.getElementById("mod-fnm-box").value, 
        lastname: document.getElementById("mod-lnm-box").value,
        email: document.getElementById("mod-eml-box").value , username: document.getElementById("mod-usr-box").value, 
        passwordHash: document.getElementById("new-psw-box").value})
    });

    //Everytime user logs in we need to getBoards() and getTasks() to render 
    
    //get all the boards (Objects) saved in the user (Object)

    //get all the tasks (Objects) saved in the user (Object)

    // redirect to board page when click on new board button 
    document.getElementById("new-board-btn").addEventListener('click', function(){
        //create a empty board and ridirect to that 
        window.location.href = "./emptyBoard.html";
    });

    // redirect to board page when click on board preview 
    document.getElementById("board-one").addEventListener('click', function(){
        window.location.href = "./board.html";
    });
}

