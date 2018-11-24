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
    console.log("Command received: " + command);
    if (args.length !== 0) {
        console.log("Arguments: " + args.join(" "));
    }
    

    // nullary commands
    if (args.length === 0) {
        // Joke command
        if (command === "joke") {
            // react to the message
            message.react("👍");
            // send a joke to the channel of the message
            message.channel.send(jokesList.getJoke());
        }
    }
    // unicode commands
    if (args.length === 1){
        // Kick command
        if (command === "kick") {
            // take the first mentioned user of the message
            let member = message.mentions.members.first();
            // the reason why the user is getting kicked
            let reason = args.slice(1).join(" ");
            // if member exists
            if (member) {
                // attempt to kick with the specified reason
                member.kick(reason)
                .then((member) => {
                    // Succesfull kick
                    message.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
                }).catch(() => {
                    // Unsuccesful kick
                    message.channel.send("Access Denied");
                });

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
    
    
});



client.login(token);