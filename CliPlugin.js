var util = require('util');
var sleep = require('system-sleep');
var async = require("async");

// ******** end of global variables *****************

var CliPlugin = function() {

//change to wanted hostname (name or ip)
var arrayOfConsoleServers =    [ "ciscoHost" ];         
//hardcoded list for test
var ipList = ["12.23.21.222", "23.22.11.33"];
//list of commands template (todo: access-list assignment to interface 'ip access-group OneFire')
//remark can be ignored probably
var arrayOfCommandsTemplate =    ["conf t","ip access-list standard OneFire","remark remark","end","exit","logout\r\n"];
var arrayOfCommandsAssociate = ["conf t", "ip access-list standard OneFire", "end", "conf t", "ip access-group OneFire in", "end", "exit"];
//0 init, 1 add, 2 delete, for now
var opsType = 1; //up to now it is always add (from main must be passed)
// *********************  connection parameters  ************

var readyTimeout = 45000;   // 45 seconds.
var idleTimeout = 30000;   // 10 seconds.

var verboseStatus = true;
var debugStatus = true;
//if root no problem, else login command must be added
var username = "cisco";
var password = "cisco";

var customStandardPrompt = ">$%#)(";   // default prompt

var arrayOfKex = [
                'diffie-hellman-group1-sha1',
                'ecdh-sha2-nistp256',
                'ecdh-sha2-nistp384',
                'ecdh-sha2-nistp521',
                'diffie-hellman-group-exchange-sha256',
                'diffie-hellman-group14-sha1'];

var arrayOfCipher = [
                'aes128-ctr',
                'aes192-ctr',
                'aes256-ctr',
                'aes128-gcm',
                'aes128-gcm@openssh.com',
                'aes256-gcm',
                'aes256-gcm@openssh.com',
                'aes256-cbc' ];

/*
******************
*****All-in method
******************
*/
var connectViaSSH = function(connectToHost, port, opsType, endHost, args, callback) {
    var arrayOfCommands;
    //adding/removing at correct position ipS to block
    if(opsType == 1) {
        console.log("ADD operation, parsing ip list");
        for(var i=0; i<args.length; i++) {
                arrayOfCommandsTemplate.splice(4+(2*i),0,"deny "+args[i]);
                arrayOfCommandsTemplate.splice(5+(2*i),0,"remark remark");
        }
        arrayOfCommands = arrayOfCommandsTemplate;
    } else if(opsType == 2) {
        console.log("REMOVE operation, parsing ip list")
        for(var i=0; i<args.length; i++) {
                arrayOfCommandsTemplate.splice(4+(2*i),0,"no deny "+args[i]);
                arrayOfCommandsTemplate.splice(5+(2*i),0,"remark remark");
        }
        arrayOfCommands = arrayOfCommandsTemplate;
    } else if(opsType == 0) {
        console.log("ASSOCIATE operation, adding interface")
        arrayOfCommandsAssociate.splice(4,0,"interface "+args);
        arrayOfCommands = arrayOfCommandsAssociate;
    } else {
      console.log("Unsupported type of operation");
    }
    var listOfCommands = arrayOfCommands.slice(0,arrayOfCommands.length);       

    var connectedToConsoledHost  = false;

    var host = {
        server: {
            host: connectToHost,
            port: port,
            userName: username,
            password: password,
            hashMethod:     "md5", 
            readyTimeout: readyTimeout,
            tryKeyboard: true,
            algorithms: {
                kex: arrayOfKex,
                cipher: arrayOfCipher
                }
            },

            standardPrompt: customStandardPrompt,
            commands: listOfCommands,
            msg: {
                send: function( message ) {
                    console.log("message: " + message);
                }
            },

            verbose: verboseStatus,
            debug: debugStatus,
            idleTimeOut: idleTimeout,
            ["keyboard-interactive"]: function(name, instructions, instructionsLang, prompts, finish){
                console.log('Connection :: keyboard-interactive');
                finish([password]);
            },

            onCommandProcessing:   function( command, response, sshObj, stream  ) {
                console.log("in 'onCommandProcessing' ");
                if (command === "" && response === "Connected to port" ) {
                    connectedToConsoledHost = true;
                    stream.write("\r");
                    sshObj.msg.send("in 'onCommandProcessing' yes it matched. sending newline");
                }
            },
      
            onCommandComplete:   function( command, response, sshObj ) {
                if(connectedToConsoledHost == true){
                    if( response.indexOf(endHost) > -1){
                        sshObj.msg.send("Console port connected");
                    }
                }
            },

            onCommandTimeout: function( command, response, stream, connection ) {
                console.log("--->  entered onCommandTimeout with - \n command: '" + command + "' \n response: '" + response + "'");
                stream.end();
                connection.end();
            },

            onEnd: function( sessionText, sshObj ) {
                sshObj.msg.send("reached 'onEnd'");
                callback(0,sessionText);
            }

        };

   //Create a new instance
   // var SSH2Shell = require ('ssh2shell-ssh2.connect-options'),     //     doesn't work
   var SSH2Shell = require ('ssh2shell'),     //    it  works 
   SSH = new SSH2Shell(host);

   SSH.connect();

}




this.mainApp = function(opsType, argumentList){

    var consoleServer = arrayOfConsoleServers[0];
    var port = 22; //properties candidate?

    console.log("entered mainApp");

    // ********** verify environment is setup correctly ******

    //To change with correct host (name or ip) -> properties candidate
    var endHost = "ciscoHost";

    connectViaSSH(consoleServer, port, opsType, endHost, argumentList,
        function(err, data){

            console.log(" -------- connected to consoled host: " + endHost + " -----------");

            console.log(data);

            console.log(" ---  end of data received from last consoled host ------  ");
        }
    );

}


}

module.exports = CliPlugin;

//other params like hostname, user and pwd should pass from here
//mainApp(opsType, ipList);
