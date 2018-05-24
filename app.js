var host = 'host';
var user = 'user';
var psw = 'psw';
var cliPlugin = require('./CliPlugin.js');
var cliPluginCommand = new cliPlugin(host, user, psw);

cliPluginCommand.async( function callback(jsonArray) {
    console.log(JSON.stringify(jsonArray[0]));
});