var builder = require('botbuilder');
var restify = require('restify');

var libraries = [
    require('./Lib/Version'),
    require('./Lib/ChangeName'),
    require('./Lib/Help'),
];

//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var defaultAction=function (session) {
    session.send("%s, I heard: %s", session.userData.name, session.message.text);
    session.send("Say 'help' or something else...");
}

var bot = new builder.UniversalBot(connector);

libraries.forEach((lib)=>{
    lib.addRecognizer(bot);
    bot.library(lib.createLibrary());
});

bot.dialog('/', [
    defaultAction
]);

// Add first run dialog

// Delete user data
/*
bot.on('deleteUserData', function (session) {
    console.log('deleteUserData');
    session.send("Deleting user data.");
    session.userData=null;
});
*/