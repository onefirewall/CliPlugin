var host = 'host';
var user = 'user';
var psw = 'psw';
var cliPlugin = require('./CliPlugin.js');
var cliPluginCommand = new cliPlugin(host, user, psw);

cliPluginCommand.addIpList(ipList, function callback(jsonArray) {
    console.log(JSON.stringify(jsonArray[0]));
});

cliPluginCommand.removeIpList(ipList, function callback(jsonArray) {
    console.log(JSON.stringify(jsonArray[0]));
});
