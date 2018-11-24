document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData('text', event.target.id);

    event.target.style.opacity = "0.4";
});

document.addEventListener("drag", function(event) {
  event.preventDefault();
});

document.addEventListener("dragend", function(event) {
    event.target.style.opacity = "1";
});

document.addEventListener("dragenter", function(event) {
    if ( event.target.className == "droptarget" ) {
        event.target.style.border = "3px dotted red";
    }
});

document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

document.addEventListener("dragleave", function(event) {
    if ( event.target.className == "droptarget" ) {
        event.target.style.border = "";
    }
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if ( event.target.className == "droptarget" ) {
        console.log(event.target)
        event.target.style.border = "";
        var data = event.dataTransfer.getData("text");
        console.log(event.target.style.height)
        event.target.appendChild(document.getElementById(data));
    }
});

/* 
 * User description popup
 */

function userDesc(data) {
    var popup = document.getElementById(data);
    popup.classList.toggle("show");
}

