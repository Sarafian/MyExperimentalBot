var builder = require('botbuilder');

var botVersion=0.2

var versionLib = new builder.Library('Version');

exports.addRecognizer = function (bot) {
    bot.recognizer(new builder.RegExpRecognizer('RestartIntent', /^(restart session)/i));
    bot.recognizer(new builder.RegExpRecognizer('AboutIntent', /^(About)/i));
}

exports.createLibrary = function () {
    return versionLib;
}

var about=function (session) {
    // Update version number and start Prompts
    // - The version number needs to be updated first to prevent re-triggering 
    //   the dialog. 
    session.send("Hello! I'm an experimental bot for learning purposes developed by Alex Sarafian");
    session.send("My version is %s. When the version changes we need to start over.",botVersion);
}

versionLib.dialog('about', [
    function (session) {
        about(session);
        session.endDialog();
    }
]).triggerAction({ matches: 'AboutIntent' });

versionLib.dialog('restart', [
    function (session) {
        session.userData=null;
        session.endDialog("Session restarted")
    }
]).triggerAction({ matches: 'RestartIntent' });

versionLib.dialog('firstRun', [
    function (session) {
        about(session);
        // Update version number and start Prompts
        // - The version number needs to be updated first to prevent re-triggering 
        //   the dialog. 
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
        console.log('onInterrupted:dialogId',dialogId);
        console.log('onInterrupted:dialogArgs',dialogArgs);
        // Prevent dialog from being interrupted.
        session.send("Sorry... We need some information from you first.");
        next();
    }
});

