var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/connection.properties');

var property = properties.get('some.property.name');

var host = properties.get('host');
var user = properties.get('user');
var psw = properties.get('psw');

#if user e psw has not root privileges (can be encrypted with openssl enc/dec?)
var rootUsr = properties.get('rootUsr');
var rootPwd = properties.get('rootPwd');

var ifc = properties.get('interface');

var cliPlugin = require('./CliPlugin.js');
var cliPluginCommand = new cliPlugin(host, user, psw);

cliPluginCommand.connectViaSSH(0, ifc ,function callback(jsonArray)) {
    console.log(JSON.stringify(jsonArray[0]));
});

cliPluginCommand.connectViaSSH(1, ipList, function callback(jsonArray) {
    console.log(JSON.stringify(jsonArray[0]));
});

cliPluginCommand.connectViaSSH(2, ipList, function callback(jsonArray) {
    console.log(JSON.stringify(jsonArray[0]));
});
