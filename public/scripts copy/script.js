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

    //close registration popup window
    document.getElementById("register-close").addEventListener('click', function(){
        document.querySelector('.pp-register').style.display = 'none';
    });

    //login post request   
    document.getElementById('login-btn').addEventListener('click', function(){
        doJSONRequest('POST', "/login", {'Content-Type': 'application/json'},
        {username: document.getElementById("log-usr-box").value, password: document.getElementById("log-psw-box").value})
    });

    // //register user request
    document.getElementById('register-btn').addEventListener('click', function(){
        doJSONRequest('POST', "/register", {'Content-Type': 'application/json'},
        {firstname: document.getElementById("reg-fnm-box").value, 
        lastname: document.getElementById("reg-lnm-box").value,
        email: document.getElementById("reg-eml-box").value , username: document.getElementById("reg-usr-box").value, 
        passwordHash: document.getElementById("reg-psw-box").value})
    });
}


// // Function changePassword
// // which changes the password from hidden (i.e. asterisks)
// // to text and vice versa
// function changePassword () {
//     // track the element by ID
//     //This id does not exists 
//     //can we do it with class? 
//     let pswText = document.getElementById("show-psw");
//     // if the type of the element is password
//     if (pswText.type === "password") {
//         // change type to text
//         pswText.type = "text";
//     } else {
//         // in case it's text (or anything else which shouldn't happen)
//         // change it to password
//         pswText.type = "password";
//     }
// }


//=============================================================
// BOARD PAGE FUNCTIONS
//=============================================================

// initialization of id
let id = 0;

// ID function
function newId () {
    return id++;
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
        div.className = "droptarget";

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

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        let modal = document.querySelector(".pp-register");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }   
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
    taskDiv.className = "sticker";
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

    // change opacity of the dragged element
    event.target.style.opacity = "0.4";
});

// Event listener attached to the window (whole browser)
// which detects when an element is simply dragged and we keep the mouse on the element
document.addEventListener("drag", function(event) {
    // prevent default
    event.preventDefault();
});

// Event listener attached to the window (whole browser)
// which detects when an element is released from a drag event
// doesn't matter if the element is in a dropzone
document.addEventListener("dragend", function(event) {
    // change opacity of the dragged element
    event.target.style.opacity = "1";
});

// Event listener attached to the window (whole browser)
// which detects when a dragged element enters a dropzone
document.addEventListener("dragenter", function(event) {
    // if we drag the element through a dropzone
    if ( event.target.className == "droptarget" ) {
        // change the style of the border
        event.target.style.border = "3px dotted red";
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
    // if we drag the element from a dropzone
    if ( event.target.className == "droptarget" ) {
        // change the border style
        event.target.style.border = "";
    }
});

// Event listener attached to the window (whole browser)
// which detects when the dragged object is dropped
document.addEventListener("drop", function(event) {
    // prevent default
    event.preventDefault();
    // if dropped over a dropzone
    if ( event.target.className == "droptarget" ) {
        // change border
        event.target.style.border = "";
        // we get the id of the element from inside the transfer object that we initialized
        let data = event.dataTransfer.getData("text");
        // appending before the create new task button by tracking with the ID
        event.target.lastElementChild.before(document.getElementById(data));
    }
});

// function for showing the user description
function userDesc(data){
    // track the popup element
    let popup = document.getElementById(data);
    // console.log(popup);
    // make it visible
    popup.classList.toggle("show");
}
