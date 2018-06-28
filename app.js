
var host = "ciscoHost";
var user = "root";
var psw = "root";

var ifc = "f0/0";
var port = 22;

//var jsonConfig = {"host":host,"user":user,"psw":psw,"ifc":ifc,"port":port};

var CliPlugin = require('./CliPlugin.js');
var cliPluginCommand = new CliPlugin(host, user, psw);
//or
//var cliPluginCommand = new CliPlugin(jsonConfig.host, jsonConfig.user, jsonConfig.psw);

//exampleList
//var ipListbrief=["12.23.2.1","23.2.1.3"];
//var ipList=["222.12.3.22", "23.11.3.2", "3.2.1.3", "4.2.1.4", "5.4.3.2", "1.2.3.4", "1.2.3.4","1.2.3.5","1.2.3.6","1.2.3.7","1.2.3.8","1.2.3.9","1.2.3.10","1.2.3.11","1.2.3.12","1.2.3.13","1.2.3.14","1.2.3.15","1.2.3.16","1.2.3.17","1.2.3.18","1.2.3.19","1.2.3.20","1.2.3.21","1.2.3.22","1.2.3.23","1.2.3.24","1.2.3.25","1.2.3.26","1.2.3.27","1.2.3.28","1.2.3.29","1.2.3.30","1.2.3.31","1.2.3.32","1.2.3.33","1.2.3.34","1.2.3.35","1.2.3.36","1.2.3.37","1.2.3.38","1.2.3.39","1.2.3.40","1.2.3.41","1.2.3.42","1.2.3.43","1.2.3.44","1.2.3.45","1.2.3.46","1.2.3.47","1.2.3.48","1.2.3.49","1.2.3.50","1.2.3.51","1.2.3.52","1.2.3.53","1.2.3.54","1.2.3.55","1.2.3.56","1.2.3.57","1.2.3.58","1.2.3.59","1.2.3.60","1.2.3.61","1.2.3.62","1.2.3.63","1.2.3.64","1.2.3.65","1.2.3.66","1.2.3.67","1.2.3.68","1.2.3.69","1.2.3.70","1.2.3.71","1.2.3.72","1.2.3.73","1.2.3.74","1.2.3.75","1.2.76","1.2.3.77","1.2.3.78","1.2.3.79","1.2.3.80","1.2.3.81","1.2.3.82","1.2.3.83","1.2.3.84","1.2.3.85","1.2.3.86","1.2.3.87","1.2.3.88","1.2.3.89","1.2.3.90","1.2.3.91"];

//1 ADD, 2 DELETE, 3 CLEAR, 0 show?
cliPluginCommand.sshToNode(1 , ipList, ifc, port);
