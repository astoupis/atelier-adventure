/*
 * LOGIN PAGE FUNCTIONS
 */


// Function addListeners
// which adds the listeners for various buttons
// such as the checkbox button
function addListeners () {
    // track the element by ID
    let pswCheckbox = document.getElementById("psw-checkbox");
    // add the event listener to the checkbox
    pswCheckbox.addEventListener("click", changePassword.bind(this));
    
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

// Function changePassword
// which changes the password from hidden (i.e. asterisks)
// to text and vice versa
function changePassword () {
    // track the element by ID
    let pswText = document.getElementById("show-psw");
    // if the type of the element is password
    if (pswText.type === "password") {
        // change type to text
        pswText.type = "text";
    } else {
        // in case it's text (or anything else which shouldn't happen)
        // change it to password
        pswText.type = "password";
    }
}

/**************************************************************************************************/

/*
 * BOARD PAGE FUNCTIONS 
 */

//Event listener attachded to the windows object (whole brswer) 
//which detects when a draggable element is dragged
document.addEventListener("dragstart", function(event) {
    //we attach the id of the element inside a transfer object to get it again at the drop event (laster event)
    //Here we have only attached the id of the element dragged
    event.dataTransfer.setData('text', event.target.id); 

    //the dragged element see his opacity changed
    event.target.style.opacity = "0.4";
});

//Event listener for adding something during the drag
//which is when the element is simply dragged and we keep the mouse on the element
document.addEventListener("drag", function(event) {
  event.preventDefault();
});

//Event listener for adding something when the drag ends
//which is when we release the mouse button (it does not matter here if the element is in a dropzone or not)
document.addEventListener("dragend", function(event) {
    event.target.style.opacity = "1";
});

//Event listener when the draggable object (which are the element with the class droptarget in html) enter a dropzone 
document.addEventListener("dragenter", function(event) {
    //the dropzone element have their border in dotted red
    if ( event.target.className == "droptarget" ) {
        event.target.style.border = "3px dotted red";
    }
});

//Event listener when the draggable object is over a dropzone
document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

//Event listener when the draggable object leave the dropzone
document.addEventListener("dragleave", function(event) {
    //we simple remove the dotted effect of the dropzone
    if ( event.target.className == "droptarget" ) {
        event.target.style.border = "";
    }
});

//Event listener when the draggable object is dropped in the dropzone
document.addEventListener("drop", function(event) {
    event.preventDefault();

    if ( event.target.className == "droptarget" ) {
        
        event.target.style.border = ""; //the event target get again his normal border
        
        var data = event.dataTransfer.getData("text"); //we get the id of the element inside the transfer obejct that we initialized
    
        event.target.appendChild(document.getElementById(data)); //we append the element get with the idea inside the div drop zone
    }
});


function userDesc(data){
    let popup = document.getElementById(data);
    console.log(popup);
    popup.classList.toggle("show");
}
