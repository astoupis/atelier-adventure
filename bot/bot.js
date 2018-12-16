// Modules
const Discord = require('discord.js');
const client = new Discord.Client();
// Require file with token, prefix, etc.
const config = require('./config.json');
const jokesList = require('./jokes.js');


// the prefix set in the config.json file
let prefix = config.prefix;
// the token set in the config.json file
let token = config.token;
// Whenever the bot is ready...
client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    console.log("Ready to work");
    // Set bot status to online
    client.user.setStatus('online');
});



// Whenever there is a message...
// "async” before a function means one simple thing:
// a function always returns a promise
client.on('message', async (message) => {
    // if the author of the message is a bot
    // do nothing
    if (message.author.bot) {
        return;
    }

    // if the message doesn't begin with the prefix,
    // do nothing
    if (message.content.indexOf(prefix) !== 0) {
        return;
    }

    // Remove prefix, 
    // trim extra spaces before/after the text,
    // split the string by one or many spaces
    // (-> <prefix><command> <args1> <args2>      <args3>)
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    // take the command and make it to lower case
    const command = args.shift().toLowerCase();

    // Some log statements on the server side
    console.log("Command received: " + command);
    // Log the arguments only if they exist and connect them with space
    if (args.length !== 0) {
        console.log("Arguments: " + args.join(" "));
    }
    

    // nullary commands
    if (args.length === 0) {
        // Joke command
        if (command === "joke") {
            // react to the message with the specified unicode emoji
            message.react("👍");
            // send a joke to the channel of the message
            message.channel.send(jokesList.getJoke());
        }
        // Wow command
        if (command === "wow") {
            // send a joke to the channel of the message
            // 2nd argument optional: object
            // object contains the path to the file or the url
            message.channel.send( "" , {
                file: "./gifs/wow.gif"
            });
        }
        // Help command
        if (command === "help") {
            // send help message
            message.channel.send("There is no help!");
        }
        // Hello command
        if (command === "hello") {
            // send hello message
            message.channel.send(":wave: " + "Hello " + message.author + "!");
        }
        // Think command
        if (command === "think") {
            // send message
            message.channel.send(":thinking: " + "I'm thinking...");
        }
    }
    // unicode commands
    // for ultra clearing
    if (args.length === 1 || ((command === "purge") && (args[1] === "ultra"))){
        // Kick command
        if (command === "kick") {
            // take the first mentioned user of the message
            let member = message.mentions.members.first();
            // the reason why the user is getting kicked
            let reason = args.slice(1).join(" ");
            // if member exists
            if (member) {
                // if member has the kick permission
                if(message.member.hasPermission("KICK_MEMBERS")) {
                    // attempt to kick with the specified reason
                    member.kick(reason)
                    .then((member) => {
                        // Succesfull kick
                        // Send message to confirm (to the channel of the kick command)
                        // member.displayName holds the String of the user
                        message.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
                    }).catch(() => {
                        // Unsuccesful kick
                        // Send message to notify of the unsuccesful kick (to the channel of the kick command)
                        message.channel.send("Access Denied");
                    });
                    console.log(`Yay, the author of the message has the role!`);
                } else {
                    // member doesn't have the role
                    message.channel.send("Nope, noppers, nadda.");
                    console.log(`Nope, noppers, nadda.`);
                }
                
            // if member was not existant
            } else {
                // notify the channel
                message.channel.send("User not found");
                console.log("invalid user");
            }
            
        }
        // Purge command
        if (command === "purge"){
            // invalid number
            if (args[0] > 100 || args[0] <= 0){
                // notify channel
                message.channel.send("Please select a number between 1 and 100");
                // stop execution
                return;
            }
            // Bulk delete # messages of the specified channel
            // where # is the number as a parameter
            message.channel.bulkDelete(args[0])
            .then((messages) => {
                // Ultra clearing
                // (no confirmation message)
                if (args[1] === "ultra") {
                    return;
                }
                // deletion was succesful
                // notify the channel
                message.channel.send(`Succesfully deleted ${messages.size} messages`);
                console.log(`Bulk deleted ${messages.size} messages`);
            })
            .catch((error)=>{
                // deletion was unsuccesful
                console.log(error);
            });
        }
    }
    return;
    
    
});



client.login(token);

module.exports = function(message) {
    client.channels.get(config.channelId).send(message);
};
