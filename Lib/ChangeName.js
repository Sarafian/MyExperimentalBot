var builder = require('botbuilder');

var changeNameLib = new builder.Library('ChangeName');

exports.addRecognizer = function (bot) {
    bot.recognizer(new builder.RegExpRecognizer('ChangeNameIntent', /^(change name)/i));
}

exports.createLibrary = function () {
    return changeNameLib;
}

// Change name dialog
changeNameLib.dialog('changeName', [
    function (session) {
        if(session.userData.name) {
            builder.Prompts.text(session, "What's your new name?");
        }else {
            builder.Prompts.text(session, "Hello... What's your name?");
        }
    },
    function (session, results) {
        console.log('changeName:results.response',results.response); 
        session.userData.name = results.response;
        session.endDialog("Hi %s.", session.userData.name); 
    }
]).triggerAction({ matches: 'ChangeNameIntent' });