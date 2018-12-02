const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const dust = require('klei-dust');
const methodOverride = require('method-override');
const app = express();
const config = require("./config");
const cookieParser = require('cookie-parser');



//Mongoose Server
const mongoose = require('mongoose');
mongoose.connect(config.database, {useNewUrlParser: true});
app.set('superSecret', config.secret);

//Dust
app.set('views', './views');
app.engine('dust', dust.dust);
app.set('view engine', 'dust');
app.set('view options', {layout: false});
app.use(express.static(__dirname + '/public'));

//Cookie parser
app.use(cookieParser());

//Body parser
app.use(bodyParser.json({type: 'application/json', limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({type: 'application/x-www-form-urlencoded', limit: '50mb', extended: true}));

//Method override//dbfdiufhdaudfghfufdvbcu<bdffiusdbvdiuvb
app.use(methodOverride('method'));

const routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/login', routers.login);
app.use('/register', routers.register);
app.use('/users', routers.user); 
app.use('/board', routers.board);
app.use('/list', routers.list); 

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
