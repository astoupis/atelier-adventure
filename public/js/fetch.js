// doFetchRequest method
function doFetchRequest(method, url, headers, body){
    if (arguments.length !== 4) {
        throw err;
    }
    if(method === "GET" || method === "POST" || method === "DELETE" || method === "PUT"){
        if (method === "GET"){
            if(body){
                throw err;
            }
            else {
                return fetch(url, {
                    method: method,
                    headers: headers,
                    credentials: "same-origin"
                });
            }
        }
        else if (method === "POST" || method === "PUT"){
            if(body === null || typeof body === "string"){
                if(method === "PUT"){
                    return fetch(url, {
                        method: method,
                        body: body,
                        headers: headers
                    });
                }
                else if (method === "POST"){
                    return fetch(url, {
                        method: method,
                        body: body,
                        headers: headers
                    });
                }
                else{
                    throw err;
                }

            }
            else{
                throw err;
            }
        }
        else if (method === "DELETE"){
            return fetch(url, {
                method: method,
                headers: headers
            });
        }
        else {
            console.log("method not correct")
            throw err;
        }

    }
    else{
        console.log("error");
        throw err;
    }
}

function doJSONRequest(method, url, headers, body){
    if (arguments.length !== 4) {
        throw err;
    }
    if (headers["Content-Type"] && headers["Content-Type"] !== "application/json") {
        throw err;
    }

    if (headers["Accept"] && headers["Accept"] !== "application/json") {
        throw err;
    }

    headers['Accept'] = 'application/json';
    if (method === "POST" || method === "PUT"){
        headers["Content-Type"] = "application/json";
        return doFetchRequest(method, url, headers, JSON.stringify(body)).then((result) => result.json());
    }
    if (method === "GET" || method === "DELETE"){
        return doFetchRequest(method, url, headers, body).then((result) => {
            return result.json()
        });
    }
    throw err;
}


  /***************************/
 /**Board preview rendering**/
/***************************/ 

function getBoardPrev(id){

    // take all the the board ids and render all the boards 
    doJSONRequest('GET', "/board/" + id,{}, undefined)
    .then((board)=>{
      //need to create a board_partial to render 
    //   console.log(board);
      dust.render('partials\/board_partial', board ,function(err, dataOut) {
                     // out contains the rendered HTML string.
                     console.log(err);
                     document.getElementById('posted-boards').innerHTML += dataOut;
      });
    });
};


function userUpdate(){
    doJSONRequest('GET', "/user", {}, undefined)
    .then(function(user) {
        user.avatarLetters = user.firstname.charAt(0) + user.lastname.charAt(0);
        dust.render('partials\/userpage_title', user, function(err, dataOut) {
            dataOut.split("")
            // out contains the rendered HTML string.
            console.log(err);
            document.getElementById('usr-page-title').innerHTML = dataOut;
        });
        dust.render('partials\/user_info', user, function(err, dataOut){
            console.log(err);
            document.getElementById('usr-info').innerHTML = dataOut;
        });
        dust.render('partials/user_update_pp', user,function(err, dataOut){
            document.getElementById('usr-update-pp').innerHTML = dataOut;
        })
    });
}

function boardCreate(){
    doJSONRequest('POST', "/board", {}, {name: document.getElementById('board-name').value})
    .then(function(board){
        getBoardPrev(board._id);
    })
}
