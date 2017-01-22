var builder = require('botbuilder');
var restify = require('restify');

var botVersion=0.1

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
bot.recognizer(new builder.RegExpRecognizer('HelpIntent', /^(help|options)/i));


bot.dialog('/', [
    defaultAction
]);

// Add first run dialog
bot.dialog('firstRun', [
    function (session) {
        // Update version number and start Prompts
        // - The version number needs to be updated first to prevent re-triggering 
        //   the dialog. 
        session.send("This is a new version %s of the bot. We need to start over.",botVersion);
        session.userData.version = botVersion; 
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        // We'll save the users name and send them an initial greeting. All 
        // future messages from the user will be routed to the root dialog.
        session.userData.name = results.response;
        session.endDialog("Hi %s, say something to me and I'll echo it back.", session.userData.name); 
    }
]).triggerAction({
    onFindAction: function (context, callback) {
        console.log('onFindAction: Trigger_First_Run', process.env.Trigger_First_Run);
        var score=1.1;
        switch (process.env.FIRST_RUN_DIALOG) {
            case "Always":
                break;
            case "VersionChange":
            default:
                // Trigger dialog if the users version field is less than 1.0
                // - When triggered we return a score of 1.1 to ensure the dialog is always triggered.
                var ver = context.userData.version || 0;
                console.log('onFindAction: ver', ver);
                var score = ver < botVersion ? 1.1: 0.0;
                console.log('onFindAction: score', score);
                break;
        }
        callback(null, score);
    },
    onInterrupted: function (session, dialogId, dialogArgs, next) {
        console.log('onInterrupted');
        // Prevent dialog from being interrupted.
        session.send("Sorry... We need some information from you first.");
    }
});

// Add help dialog
bot.dialog('helpDialog', function (session, args) {
    switch (args.action) {
        default:
            // args.action is '*:/help' indicating the triggerAction() was matched
            session.endDialog("Simple echo bot. Say something and I'll repeat it.");
            break;
    }
}).triggerAction({ matches: 'HelpIntent' });

// Delete user data
/*
bot.on('deleteUserData', function (session) {
    console.log('deleteUserData');
    session.send("Deleting user data.");
    session.userData=null;
});
*/