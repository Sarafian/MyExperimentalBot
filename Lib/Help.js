var builder = require('botbuilder');

var helpLib = new builder.Library('Help');

exports.addRecognizer = function (bot) {
    bot.recognizer(new builder.RegExpRecognizer('HelpIntent', /^(help)/i));
}

exports.createLibrary = function () {
    return helpLib;
}


helpLib.dialog('help', function (session, args) {
    console.log('Help:help:args.action ',args.action); 
    switch (args.action) {
        default:
            session.send("Say (something) and I'll repeat it.");
            session.send("Say (change name) to change your name.");
            session.send("Say (help) or (options) to show this help message.");
            session.send("Say (about) to show the bot information.");
            session.send("Say (restart session) to restart the session.");
            // args.action is '*:/help' indicating the triggerAction() was matched
            session.endDialog("Try it now.");
            break;
    }
}).triggerAction({ matches: 'HelpIntent' });
