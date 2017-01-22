var builder = require('botbuilder');
var restify = require('restify');

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
var bot = new builder.UniversalBot(connector);

//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/name');
    }
]);
/*
intents.matches(/^subscribe/i, [
    function (session) {
        session.beginDialog('/subscribe');
    },
    function (session, results) {
        session.send('Ok... You are subscribed');
    }
]);
*/
intents.onDefault([
    function (session, args, next) {
        session.send('Hello. This is Alex Sarafian experimental chat bot. Have fun!');
        if (!session.userData.name) {
            session.send('This is our first time together. I would like to know your name please.');
            session.beginDialog('/name');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/name', [
    function (session) {
        if (!session.userData.name) {
            builder.Prompts.text(session, 'Please tell me your name.');
        } else {
            builder.Prompts.text(session, 'Please tell me your new name.');
        }
    },
    function (session, results) {
        if (!session.userData.name) {
            session.send('Nice to meet you %s.',results.response);
        } else {
            session.send('%s, I will now call you %s.',session.userData.name,results.response);
        }
        session.userData.name = results.response;
        session.send('%s, if you want to change your name please type "Change name"',session.userData.name);
        session.endDialog();
    }
]);
/*
bot.dialog('/subscribe', [
    function (session, args) {
        // Serialize users address to a string.
        var address = JSON.stringify(session.message.address);

        // Send back your address.
        session.send('Your address is %s!', address);
        session.endDialog();
    }
]);
*/