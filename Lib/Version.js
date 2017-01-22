var builder = require('botbuilder');

var botVersion=0.2

var versionLib = new builder.Library('Version');

exports.addRecognizer = function (bot) {
//    bot.recognizer(new builder.RegExpRecognizer('HelpIntent', /^(version)/i));
}

exports.createLibrary = function () {
    return versionLib;
}

versionLib.dialog('firstRun', [
    function (session) {
        // Update version number and start Prompts
        // - The version number needs to be updated first to prevent re-triggering 
        //   the dialog. 
        session.send("This is a new version %s of the bot. We need to start over.",botVersion);
        session.userData.version = botVersion; 
        session.beginDialog("ChangeName:changeName");
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

