const express = require('express');
const http = require('http');
const https = require('https');

const bodyParser = require('body-parser');
const dust = require('klei-dust');
const methodOverride = require('method-override');

const app = express();
const config = require('./config');
const cookieParser = require('cookie-parser');
const loginMiddleware = require('./util/auth').loginMiddleware;


const fs = require('fs');


// EVENT BUS
const eventBus = require('./eventBus');


//Mongoose Server
const mongoose = require('mongoose');
mongoose.connect(config.database, {useNewUrlParser: true});
app.set('superSecret', config.secret);

//Dust
app.set('views', __dirname + '/views');
app.engine('dust', dust.dust);
app.set('view engine', 'dust');
app.set('view options', {layout: false});
app.use(express.static(__dirname + '/public'));

//Cookie parser
app.use(cookieParser());

//Login
app.use(loginMiddleware);

//Body parser
app.use(bodyParser.json({type: 'application/json', limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({type: 'application/x-www-form-urlencoded', limit: '50mb', extended: true}));

//Method override//dbfdiufhdaudfghfufdvbcu<bdffiusdbvdiuvb
app.use(methodOverride('method'));

const routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/login', routers.login);
app.use('/register', routers.register);
app.use('/user', routers.user); 
app.use('/board', routers.board);
app.use('/list', routers.list); 
app.use('/task', routers.task); 
app.use('/logout', routers.logout);




let httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 3000);


if(config.https.useHTTPS) {
	let credentials = {
		cert: fs.readFileSync(config.https.certificatePath),
		key: fs.readFileSync(config.https.privateKeyPath),
	}

	let httpsServer = https.createServer(credentials , app);
	httpsServer.listen(process.env.PORT || 3001);
}


// BOT
const bot = require('./bot/bot');

eventBus.on("BOT.TASK.CREATE", function(queryObject) {
	bot("EVERYBODY RUN, THERE IS A NEW TASK IN TOWN. Buckle up! It's gun is loaded with " + queryObject.taskId + " bullets");
});

eventBus.on("BOT.TASK.UPDATE", function(queryObject) {
	bot("We updated the task with id " + queryObject.taskId + " .");
});

eventBus.on("BOT.TASK.DELETE", function(queryObject) {
	bot(":wave: " + "Task with id " + queryObject.taskId + " has been deleted. Ciao!");
});

eventBus.on("BOT.LIST.CREATE", function(queryObject) {
	bot("Would you look at that!!! A new list has been created. It's id is " + queryObject.listId);
});

eventBus.on("BOT.LIST.UPDATE", function(queryObject) {
	bot("The list with id " + queryObject.listId + " has been updated. TIGHT");
});

eventBus.on("BOT.LIST.DELETE", function(queryObject) {
	bot(":wave: " + "List with id " + queryObject.listId + " has been deleted. Adios!");
});

eventBus.on("BOT.BOARD.CREATE", function(queryObject) {
	bot("A new board has been created with id " + queryObject.boardId);
});

eventBus.on("BOT.BOARD.UPDATE", function(queryObject) {
	bot("The board with id " + queryObject.boardId + " has been updated ... . Don't forget to take a look.");
});

eventBus.on("BOT.BOARD.DELETE", function(queryObject) {
	bot(":wave: " + "Board with id " + queryObject.boardId + " has walked the plank! :skull_crossbones: ");
});





// SOCKETS (TO BE MOVED TO ANOTHER MODULE)

class SocketSubscriptions {
	/**
	 * Subscribes the given socket to the given id
	 * @param {string} id the id to which the socket will be appended
	 * @param {SocketIO.Socket} socket the socket, which should be subscribed to id
	 */
	subscribe(id, socket) {
		(this[id] === undefined ? (this[id] = new Set()) : this[id]).add(socket);
	}

	/**
	 * Unsibscribes the given socket from the given id
	 * @param {string} id the id to which the socket will be removed
	 * @param {SocketIO.Socket} socket the socket, which should be unsubscribed from id
	 */
	unsubscribe(id, socket) {
		if(!this[id]) return;
		if(this[id].size === 1) delete this[id];
		else this[id].delete(socket);
	}

	/**
	 * This callback is used to perform some action on the socket-subscribers of this id
	 * @callback consumerFunction
	 * @param {SocketIO.Socket} socket the socket, which is subscribed to the given id
	 */

	/**
	 * Given the id and a consumer function, iterates through the subscribers of the id
	 * @param {string} id the id, through whose subscribers should iterate the consumer
	 * @param {consumerFunction} consumerFunction 
	 */
	forEach(id, consumerFunction) {
		if(!this[id] || this[id].size === 0) return;
		this[id].forEach(consumerFunction);
	}
}


const socketSubscriptions = new SocketSubscriptions();
const io = require('socket.io')(httpServer);
io.on("connection", function(socket) {
	let subscriptionIdArray;

	socket.on("CONNECT", function(idArray) {
		console.log("Client connected to the socket system");
		subscriptionIdArray = idArray;


		if(!(subscriptionIdArray instanceof Array)) return;
		subscriptionIdArray.forEach(function(id) {
			socketSubscriptions.subscribe(id, socket);
		});
	});

	socket.on("disconnect", function() {
		console.log("Client disconnected from the socket system");

		if(!(subscriptionIdArray instanceof Array)) return;
		subscriptionIdArray.forEach(function(id) {
			socketSubscriptions.unsubscribe(id, socket);
		});
	});
})

eventBus.on("TASK.UPDATE", function(queryObject) {
	socketSubscriptions.forEach(queryObject.id, function(socket) {
		socket.emit("TASK.UPDATE", queryObject);
	});
});

eventBus.on("LIST.UPDATE", function(queryObject) {	
	socketSubscriptions.forEach(queryObject.id, function(socket) {
		socket.emit("LIST.UPDATE", queryObject);
	});
	
});

eventBus.on("BOARD.UPDATE", function(queryObject) {
	socketSubscriptions.forEach(queryObject.id, function(socket) {
		socket.emit("BOARD.UPDATE", queryObject);
	});
});

