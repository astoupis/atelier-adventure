(function(dust){dust.register("board",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE HTML><html><head><title>Project page prototype</title><!-- CSS --><link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\"><!-- FONTS --><link href=\"https://fonts.googleapis.com/css?family=Poiret+One\" rel=\"stylesheet\"><!-- META --><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"></head><body onload=\"addListeners2()\"><header><h1 id='project-title'>Web Atelier 3 - Project</h1><input type=\"button\" id=\"invite-btn\" name=\"invite-btn\" value=\"Invite\"><div class='user-img-header'><div class=\"popup\" onclick=\"userDesc('myPopup1')\"><img src='images/avatar1.png' class='user-img-header'><span class=\"popuptext\" id=\"myPopup1\"><div class='usr-desc'><label>Name:</label><p>Bernard VonDent</p></div><div class='usr-desc'><label>E-mail:</label><p>b.vondent@gmail.com</p></div><div class=\"usr-desc\"><label>Role:</label><p>Supervisor</p></div></span></div><div class=\"popup\" onclick=\"userDesc('myPopup2')\"><img src='images/avatar2.png' class='user-img-header'><span class=\"popuptext\" id=\"myPopup2\"><div class='usr-desc'><label>Name:</label><p>Benny DeVin</p></div><div class='usr-desc'><label>E-mail:</label><p>b.devin@gmail.com</p></div><div class=\"usr-desc\"><label>Role:</label><p>Assistant</p></div></span></div><div class=\"popup\" onclick=\"userDesc('myPopup3')\"><img src='images/avatar3.png' class='user-img-header'><span class=\"popuptext\" id=\"myPopup3\"><div class='usr-desc'><label>Name:</label><p>Carl Micheal</p></div><div class='usr-desc'><label>E-mail:</label><p>c.micheal@gmail.com</p></div><div class=\"usr-desc\"><label>Role:</label><p>Programmer</p></div></span></div><div class=\"popup\" onclick=\"userDesc('myPopup4')\"><img src='images/avatar4.png' class='user-img-header'><span class=\"popuptext\" id=\"myPopup4\"><div class='usr-desc'><label>Name:</label><p>Jane Doe</p></div><div class='usr-desc'><label>E-mail:</label><p>j.doe@gmail.com</p></div><div class=\"usr-desc\"><label>Role:</label><p>Designer</p></div></span></div></div></header><!-- MAIN --><main class=\"droptarget-column\"><!-- Column --><div draggable=\"true\" class=\"droptarget movable-column\" id=\"column-2\"><!-- Title of column --><h1 class=\"state-head\" contenteditable=\"true\">To Do</h1><!-- Task --><div draggable=\"true\" id=\"task-2\" class=\"sticker movable-task\" style=\"background-color: forestgreen\"\"><h1 class='sticker'>Power Point</h1><div class='stick-desc'><label> Description: </label><p>Create a shared power point file.</p></div><div class='stick-desc'><label> Due date: </label><p> 25.11.2018 </p></div><div class='stick-desc'><label>Assigned to:</label><p><div class=\"popup\" onclick=\"userDesc('myPopup2')\"><img src='images/avatar2.png' class='sticker'></div><div class=\"popup\" onclick=\"userDesc('myPopup4')\"><img src='images/avatar4.png' class='sticker'></div></p></div></div></div><div draggable=\"true\" class=\"droptarget movable-column\" id=\"column-1\"><h1 class=\"state-head\" contenteditable=\"true\">Done </h1><div draggable=\"true\" id=\"task-1\" class=\"sticker movable-task\" style=\"background-color: coral\"><h1 class='sticker'>TASK</h1></div></div><div><input type=\"button\" id=\"addList-btn\" name=\"addList-btn\" value=\"Add List\"></div><div class=\"pp-register\"><div class=\"pp-content\"><img class=\"pp-closing-icon\" id=\"register-close\"src=\"images/closeX.png\"><form class=\"register-form\" id=\"register-div\"><h2 class=\"register\">Invite</h2><input type=\"text\" id=\"invite-box\" name=\"email\" placeholder=\"E-MAIL\" required></form><input type=\"submit\" class=\"button\" id=\"register-btn\" name=\"register-btn\" value=\"Invite\"></div></div></main><!-- FOOTER --><footer><p class='footer-credits'>Created and Designed by a group of students. </p><!-- Need to add a legenda --></footer></body><!-- SCRIPTS --><script type=\"text/javascript\" src=\"scripts/script.js\"></script><script type=\"text/javascript\" src=\"js/fetch.js\"></script></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("login",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html><head><title>Welcome - login </title><!-- CSS --><link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\"><!-- FONTS --><link href=\"https://fonts.googleapis.com/css?family=Poiret+One\" rel=\"stylesheet\"><!-- META --><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"></head><body onload=\"addListeners()\"><header class=\"login\"><h1>Welcome!</h1></br><img class=\"welcome-logo\" href=\"#\"></br><h2>Let's get started.</h2></br></header><main class=\"login\"><!-- Login form --><div class=\"login\"><form class=\"login\" method=\"POST\" action=\"/login\"><input type=\"text\" value=\"\" id=\"log-usr-box\" name=\"username\" placeholder=\"USERNAME\"><input type=\"password\" id=\"log-psw-box\" name=\"password\" placeholder=\"PASSWORD\"><div class=\"form-line\"><label class=\"login\">Show password</label><input id=\"log-psw-checkbox\" type=\"checkbox\"></div><input type=\"submit\" class=\"button\" id=\"login-btn\" name=\"login-btn\" value=\"Login\"></form><!-- not sure if we keep hit --><!-- <div class=\"psw-recover\"><p class=\"pws-recover\"><a class=\"pws-recover\" href=\"#\"> Forgot password? </a></p></div> --><!-- Open registration popup --><div class=\"signup\"><p>Not registered yet?</p><input type=\"button\" class=\"button\" id=\"signup-btn\" name=\"signup-btn\" value=\"Sign up\"></div><!-- create a popup? --><!-- <div class=\"more-info\"><p class=\"more-info\"><a class=\"more-info\" href=\"#\"> Want more information? </a></p></div> --></div><!-- this must become a popup window --><!-- Regieter form --><div class=\"pp-register\"><div class=\"pp-content\"><img class=\"pp-closing-icon\" id=\"register-close\"src=\"images/closeX.png\"><form method=\"POST\" action=\"/register\" class=\"register-form\" id=\"register-div\"><h2 class=\"register\">Sign up</h2><input type=\"text\" id=\"reg-usr-box\" name=\"username\" placeholder=\"USERNAME\" required><input type=\"text\" id=\"reg-fnm-box\" name=\"firstname\" placeholder=\"FIRST NAME\" required><input type=\"text\" id=\"reg-lnm-box\" name=\"lastname\" placeholder=\"LAST NAME\" required><input type=\"text\" id=\"reg-eml-box\" name=\"email\" placeholder=\"E-MAIL\" required><input type=\"password\" id=\"reg-psw-box\" name=\"password\" placeholder=\"PASSWORD\" required><div class=\"form-line\"><label class=\"login\">Show password</label><input id=\"reg-psw-checkbox\" type=\"checkbox\"></div><input type=\"submit\" class=\"button\" id=\"register-btn\" name=\"register-btn\" value=\"Sign Up\"></form><!-- <input type=\"submit\" class=\"button\" id=\"register-btn\" name=\"register-btn\" value=\"Sign Up\"> --></div></div></main><!-- FOOTER --><footer><p class='footer-credits'><!-- Created and Designed by a group of students.  --></p><!-- Need to add a legenda --></footer></body><!-- SCRIPTS --><script src=\"dustjs-linkedin/dust-core.min.js\" charset=\"utf-8\"></script><script type=\"text/javascript\" src=\"scripts/script.js\"></script><script type=\"text/javascript\" src=\"js/fetch.js\"></script><script src=\"js/views.js\"></script></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("register",body_0);function body_0(chk,ctx){return chk.w("<html><head><title>Atelier Adventure Registration</title></head><body><h1> Atelier Adventure simple registration form </h1><form action=\"/register\" method=\"POST\">First Name: <input type=\"text\" name=\"firstname\"><br>Last Name: <input type=\"text\" name=\"lastname\"><br>Email: <input type=\"email\" name=\"email\"><br>Username: <input type=\"text\" name=\"username\"><br>Password: <input type=\"password\" name=\"password\"><br><input type=\"submit\" value=\"Register\"></form></body></html>");}body_0.__dustBody=!0;return body_0}(dust));
(function(dust){dust.register("userpage",body_0);function body_0(chk,ctx){return chk.w("<!DOCTYPE html><html><head><title>Your profile</title><!-- CSS --><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/style.css\"><!-- FONTS --><link href=\"https://fonts.googleapis.com/css?family=Poiret+One\" rel=\"stylesheet\"><!-- META --><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"></head><body onload=\"addListeners3()\"><header><h1 class=\"usr-pg-title\"> Welcome to your profile!</h1></header><main><div class=\"usr-info\"><!-- get user display the info --><img class=\"my_avatar\" src=\"images/avatar1.png\"><div class=\"usr-info-line\"><label>Username:</label><p>bvond17</p></div><div class=\"usr-info-line\"><label>First name:</label><p>Bernard</p></div><div class=\"usr-info-line\"><label>Last name:</label><p>VonDent</p></div><div class=\"usr-info-line\"><label>E-mail:</label><p>b.vondent@gmail.com</p></div><!-- create a popup like register to modify the profile of the user and submit the changes --><!-- modify or change? --><input type=\"button\" class=\"button\" id=\"modity-btn\" value=\"Modify your profile\"></div></br><div id=\"display-board\"><div class=\"usr-boards\"><h2 class=\"usr-board-list\">Your boards.</h2><div class=\"posted-boards\"><!-- automatically display boards if any --><div class=\"board-one\" id=\"board-one\"><p class=\"board-one\">WEB ATELIER 3 - PROJECT</p></div></div><!-- add new board --><input type=\"button\" id=\"new-board-btn\" class=\"button\" value=\"New board\"></div></div><!-- <div class=\"usr-tasks\"><h2 class=\"usr-task-list\">Your tasks.</h2><div class=\"posted-tasks\"> --><!-- automatically display tasks assigned to user if any --><!-- </div></div> --><!-- modify profile popup --><div class=\"pp-register\"><div class=\"pp-content\"><img class=\"pp-closing-icon\" id=\"register-close\" src=\"images/closeX.png\"><form class=\"register-form\" id=\"register-div\"><!-- change or modify --><h2 class=\"register\">Change your profile</h2><div class=\"pp-mod-line\"><!-- check css and change class --><img class=\"mod_avatar\" src=\"images/avatar1.png\"><input id=\"importAvatar\" type=\"file\"></div><!-- is it possible to load usr \"old\" data and use them as placeholders? --><input type=\"text\" id=\"mod-usr-box\" name=\"username\" placeholder=\"USERNAME\" required><input type=\"text\" id=\"mod-fnm-box\" name=\"firstname\" placeholder=\"FIRST NAME\" required><input type=\"text\" id=\"mod-lnm-box\" name=\"lastname\" placeholder=\"LAST NAME\" required><input type=\"email\" id=\"mod-eml-box\" name=\"email\" placeholder=\"E-MAIL\" required><!-- old password new password --><input type=\"password\" id=\"old-psw-box\" name=\"password\" placeholder=\"OLD PASSWORD\" required><input type=\"password\" id=\"new-psw-box\" name=\"password\" placeholder=\"NEW PASSWORD\" required><div class=\"form-line\"><!-- chack css and change class --><!-- not working --><label class=\"login\">Show password</label><input id=\"mod-psw-checkbox\" type=\"checkbox\"></div></form><input type=\"submit\" class=\"button\" id=\"save-mod-btn\" name=\"save-mod-btn\" value=\"Save\"></div></div></main><footer><p class='footer-credits'>Created and Designed by a group of students. </p><!-- Need to add a legenda --></footer></body><!-- SCRIPTS --><script type=\"text/javascript\" src=\"scripts/script.js\"></script><script type=\"text/javascript\" src=\"main.js\"></script><script type=\"text/javascript\" src=\"js/fetch.js\"></script></html>");}body_0.__dustBody=!0;return body_0}(dust));
