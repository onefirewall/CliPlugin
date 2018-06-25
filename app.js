var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/connection.properties');

var property = properties.get('some.property.name');

var host = properties.get('host');
var user = properties.get('user');
var psw = properties.get('psw');

//if user e psw has not root privileges (can be encrypted with openssl enc/dec?)
var rootUsr = properties.get('rootUsr');
var rootPwd = properties.get('rootPwd');

var ifc = properties.get('interface');

var CliPlugin = require('./CliPlugin.js');
//var cliPluginCommand = new cliPlugin(host, user, psw);
var cliPluginCommand = new CliPlugin();

//INIT
//cliPluginCommand.mainApp(host, 0, ifc ,function callback(jsonArray) {
 //   console.log(JSON.stringify(jsonArray[0]));
//});

//exampleList
//varIpList=["222.12.3.22", "23.11.3.2"];


cliPluginCommand.mainApp(host, 1 , ipList, ifc);

//ADD
//cliPluginCommand.mainApp(host, 1, ipList, function callback(jsonArray) {
 //   console.log(JSON.stringify(jsonArray[0]));
//});


//DELETE
//cliPluginCommand.mainApp(host, 2, ipList, function callback(jsonArray) {
 //   console.log(JSON.stringify(jsonArray[0]));
//});
