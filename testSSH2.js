var util = require('util');
var sleep = require('system-sleep');
var async = require("async");

// ******** end of global variables *****************

//change to wanted hostname (name or ip)
var arrayOfConsoleServers =    [ "mdc-lab-slc-a.lab.wellmanage.com" ];         
//hardcoded list for test
var ipLists = ["12.23.21.222", "23.22.11.33"];
//list of commands template (todo: access-list assignment to interface 'ip access-group OneFire')
var arrayOfCommandsForConsoledHosts =    ["conf t","ip access-list standard OneFire","remark remark","end","exit","logout\r\n"];
//adding at correct position ipS to block (to remove 'no deny ipList[i]')
for(int i=0; i<ipList.length; i++) {
        arrayOfCommandsForConsoledHosts.splice(4+(2*i),0,"deny "+ipList[i]);
        arrayOfCommandsForConsoledHosts.splice(5+(2*i),0,"remark remark");
}

// *********************  connection parameters  ************

var readyTimeout = 45000;   // 45 seconds.
var idleTimeout = 30000;   // 10 seconds.

var verboseStatus = true;
var debugStatus = true;
#if root no problem, else login command must be added
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









var connectViaSSH = function(connectToHost, port, arrayOfCommands, endHost, callback) {

    var listOfCommands = arrayOfCommands.slice(0,arrayOfCommands.length);       
                        // creating a cloned array because the commands are removed from passed variable as they are executed.

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

                //console.log("in 'onCommandProcessing' ");

                if (command === "" && response === "Connected to port 22." ) {

                    connectedToConsoledHost = true;
                    stream.write("\r");
                    sshObj.msg.send("in 'onCommandProcessing' yes it matched. sending newline");

                }

            }, 
            onCommandComplete:   function( command, response, sshObj ) {

                if(connectedToConsoledHost == true){

                    if( response.indexOf(endHost) > -1){
                        // host name matches.

                        sshObj.msg.send(">>>>>>>> Console port connected to expected device. <<<<<<<<<<<< ");
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
                callback(0,sessionText);                // this sends the commands and output generated
            }

        };

    //Create a new instance
    //var SSH2Shell = require ('ssh2shell-master'),                 //      doesn't work.
   // var SSH2Shell = require ('ssh2shell-ssh2.connect-options'),     //     doesn't works 
    var SSH2Shell = require ('ssh2shell'),     //      works 
    SSH = new SSH2Shell(host);

    //Start the process
    SSH.connect();

}




function mainApp(){

    var consoleServer = arrayOfConsoleServers[0];
    var port = 22;

    console.log("entered mainApp");

    // ********** verify environment is setup correctly ******

    //To change with correct host (name or ip)
    var endHost = "Cisco";

    connectViaSSH(consoleServer, port, arrayOfCommandsForConsoledHosts, endHost,
        function(err, data){

            console.log(" -------- connected to consoled host: " + endHost + " -----------");

            console.log(data);

            console.log(" ---  end of data received from last consoled host ------  ");
        }
    );

}


mainApp();
