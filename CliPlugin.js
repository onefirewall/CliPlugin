
var CliPlugin = function(host, user, psw) {

this.host = host;
this.user = user;
this.psw = psw;

var accessListName = "OneFirewall"


// *********************  connection parameters  ************

var readyTimeout = 45000;   // 45 seconds.
var idleTimeout = 30000;   // 10 seconds.

var verboseStatus = false;
var debugStatus = false;

var customStandardPrompt = "#)(";   // default prompt

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
***************************
*****All-in internal method
***************************
*/
var connectViaSSH = function(host, user, psw, opsType, ipList, ifc, port, callback) {
    var listOfCommands;
    var commandFile = "commands.cfg";
    var fsLib = require('fs');
    switch(opsType) {
        
      case 1:
        var arrayOfCommandsAdd = ["conf t\n", "ip access-list standard "+ accessListName + "\n", "end\n", "conf t\n", "no ip access-group " + accessListName + " in\n", "end\n", "conf t\n", "ip access-list standard "+ accessListName + "\n", "no permit any\n", "permit any\n", "end\n", "conf t\n", "ip access-group " + accessListName + " in\n", "end\n"];

        console.log("ADD operation, parsing ip list");
        var i=0;
        while(i<ipList.length) {
                arrayOfCommandsAdd.splice(2+i,0,"deny "+ipList[i]+"\n");
                i++
        }
        arrayOfCommandsAdd.splice(4+i,0,"interface "+ifc+"\n");
        arrayOfCommandsAdd.splice(13+i,0,"interface "+ifc+"\n");
        listOfCommands = arrayOfCommandsAdd.slice(0,arrayOfCommandsAdd.length);

        fsLib.writeFile('./'+commandFile, listOfCommands, function (err) {
                if (err) throw err;
                console.log(commandFile + ' saved!');
        });

        break;

      case 2:
        //var arrayOfCommandsDelete = ["conf t", "ip access-list standard "+ accessListName + "", "end"];
        var arrayOfCommandsDelete = ["conf t\n", "ip access-list standard "+ accessListName + "\n", "end\n"];

        console.log("DELETE operation, parsing ip list");
        var i=0;
        while (i<ipList.length) {
                arrayOfCommandsDelete.splice(2+i,0,"no deny "+ipList[i]+"\n");
                i++;
        }
        listOfCommands = arrayOfCommandsDelete.slice(0,arrayOfCommandsDelete.length);

        fsLib.writeFile('./'+commandFile, listOfCommands, function (err) {
                if (err) throw err;
                console.log(commandFile + ' saved!');
        });

        break;
 
      case 3:

        var arrayOfCommandsClear = ["conf t", "interface " + ifc , "no ip access-group "+ accessListName + " in", "end", "conf t", "no ip access-list standard "+ accessListName, "end"];

        console.log("CLEAR operation");
        listOfCommands = arrayOfCommandsClear.slice(0,arrayOfCommandsClear.length);
        break;

      default:
        console.log("Unsupported type of operation");
        return;

    }

    var connectedToConsoledHost  = false;

    var hostConfig = {
        server: {
            host: host,
            port: port,
            userName: user,
            password: psw,
            hashMethod: "md5", 
            readyTimeout: readyTimeout,
            tryKeyboard: true,
            algorithms: {
                kex: arrayOfKex,
                cipher: arrayOfCipher
                }
            },

            standardPrompt: customStandardPrompt,
            commands: listOfCommands,
            verbose: verboseStatus,
            debug: debugStatus,
            idleTimeOut: idleTimeout,
            ["keyboard-interactive"]: function(name, instructions, instructionsLang, prompts, finish){
                console.log('Connection :: keyboard-interactive');
                finish([password]);
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

   //Commands execution (scp first, key algos? Avoid in case of clear operation)
   var scpClient = require('scp');
  
   scpClient.send({
    file: './'+commandFile,
    host: host,
    user: user,
    password: psw,
    path: '.',
    port: port
    }, function(err) {console.log("Could not secure copy file: "+err)})  
  
   var SSH2Shell = require ('ssh2shell');
   var SSH = new SSH2Shell(hostConfig);
   SSH.connect();

    //delete File? (it will be always overwritten)
}


/*
********************
*****Exported method
********************
*/
this.sshToNode = function(jsonConfig){

    console.log("CliPlugin module");
    if(jsonConfig === undefined || jsonConfig.ipList === undefined || ( !jsonConfig.ipList.length && (jsonConfig.opsType == 1 || jsonConfig.opsType == 2))) {
      console.log("IP list cannot be empty when ADD or DELETE operations are called")
      return;
    }
    connectViaSSH(this.host, this.user, this.psw, jsonConfig.mode, jsonConfig.ipList, jsonConfig.ifc, jsonConfig.port,
        function(err, data){

            console.log(" -------- connected to consoled host: " + this.host + " -----------");

            console.log(data);

            console.log(" ---  end of data received from last consoled host ------  ");
        }
    );

}


}

module.exports = CliPlugin;
