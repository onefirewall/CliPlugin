var util = require('util');
var sleep = require('system-sleep');
var async = require("async");

// ******** end of global variables *****************

var CliPlugin = function(host, user, psw) {

this.host = host;
this.user = user;
this.psw = psw;

var accessListName = "OneFirewall"
var arrayOfCommandsSnap = ["conf t", "no ip access-group " + accessListName + " in", "end", "conf t", "ip access-list standard "+ accessListName, "no permit any", "permit any", "end", "conf t", "ip access-group " + accessListName + " in", "end", "exit"];

// *********************  connection parameters  ************

var readyTimeout = 45000;   // 45 seconds.
var idleTimeout = 30000;   // 10 seconds.

var verboseStatus = true;
var debugStatus = true;

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
var connectViaSSH = function(opsType, ipList, ifc, port, callback) {
    var arrayOfCommands;
    //adding/removing at correct position ipS to block
    if(opsType == 1) {
        console.log("ADD operation, parsing ip list");
        arrayOfCommandsSnap.splice(1,0,"interface "+ifc);
        var i=0;
        while(i<ipList.length) {
                arrayOfCommandsSnap.splice(7+i,0,"deny "+ipList[i]);
                i++
        }
        arrayOfCommandsSnap.splice(10+i,0,"interface "+ifc);

        arrayOfCommands = arrayOfCommandsSnap;
    }
    else {
      console.log("Unsupported type of operation");
    }
    var listOfCommands = arrayOfCommands.slice(0,arrayOfCommands.length);       

    var connectedToConsoledHost  = false;

    var host = {
        server: {
            host: this.host,
            port: port,
            userName: this.user,
            password: this.psw,
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
                    console.log("in if commandProcessing");
                    connectedToConsoledHost = true;
                    stream.write("\r");
                    sshObj.msg.send("in 'onCommandProcessing' yes it matched. sending newline");
                }
            },
            //print here
            onCommandComplete:   function( command, response, sshObj ) {
                console.log("in onCommandComplete");
                if(connectedToConsoledHost == true){
                    console.log("connectedToConsoledHost true");
                    if( response.indexOf(endHost) > -1){
                        console.log("endHost in response");
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
                console.log("onEnd subsection");
                sshObj.msg.send("reached 'onEnd'");
                callback(0,sessionText);
            }

        };

   //Create a new instance
   var SSH2Shell = require ('ssh2shell'),
   SSH = new SSH2Shell(host);

   SSH.connect();

}




this.sshToNode = function(opsType, ipList, ifc, port){

    console.log("CliPlugin module");

    connectViaSSH(opsType, ipList, ifc, port,
        function(err, data){

            console.log(" -------- connected to consoled host: " + this.host + " -----------");

            console.log(data);

            console.log(" ---  end of data received from last consoled host ------  ");
        }
    );

}


}

module.exports = CliPlugin;
