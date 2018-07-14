
var CliPlugin = function(host, user, psw) {

this.host = host;
this.user = user;
this.psw = psw;


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
    var accessListName = "OneFirewall";
    var mountPoint = "flash";
    var commandFile = "commands.cfg";
    var fsLib = require('fs');
    var fileExecution = [ "tclsh " + mountPoint + ":" + commandFile, "delete /force "  + mountPoint + ":" + commandFile ];
    var cmdList;

    switch(opsType) {
        
      case 1:
        cmdList = "conf t\n ip access-list standard " + accessListName + "\n deny IP_ENTRY\n end\n conf t\n interface " + ifc + "\n no ip access-group " + accessListName + " in\n end\n conf t\n ip access-list standard " + accessListName + "\n no permit any\n permit any\n end\n conf t\n interface " + ifc + "\n ip access-group " + accessListName + " in\n end";

        console.log("ADD operation, parsing ip list");
        var i=0;
        while(i<ipList.length) {
                cmdList = cmdList.replace("IP_ENTRY", ipList[i]+"\n deny IP_ENTRY");
                i++;
        }
        cmdList = cmdList.replace(" deny IP_ENTRY\n", "");

        break;

      case 2:
        cmdList = "conf t\n ip access-list standard "+ accessListName + "\n no deny IP_ENTRY\n end";

        console.log("DELETE operation, parsing ip list");
        var i=0;
        while (i<ipList.length) {
                cmdList = cmdList.replace("IP_ENTRY", ipList[i]+"\n no deny IP_ENTRY");
                i++;
        }
        cmdList = cmdList.replace(" no deny IP_ENTRY\n", "");

        break;
 
      case 3:

        cmdList = "conf t\n interface " + ifc +"\n no ip access-group "+ accessListName + " in\n end\n conf t\n no ip access-list standard "+ accessListName + "\n end";

        console.log("CLEAR operation");
  
        break;

      default:
        console.log("Unsupported type of operation");
        return;

    }

    //Writing commands to file to be sent via scp
    fsLib.writeFile('./'+commandFile, cmdList, function (err) {
      if (err) throw err;
      console.log(commandFile + ' saved!');
    });

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
            commands: fileExecution,
            verbose: verboseStatus,
            debug: debugStatus,
            idleTimeOut: idleTimeout,
            ["keyboard-interactive"]: function(name, instructions, instructionsLang, prompts, finish){
                console.log('Connection :: keyboard-interactive');
                finish([password]);
            },
            onCommandTimeout: function( command, response, stream, connection ) {
                console.log("onCommandTimeout with - \n command: '" + command + "' \n response: '" + response + "'");
                stream.end();
                connection.end();
            },

            onEnd: function( sessionText, sshObj ) {
                sshObj.msg.send("reached 'onEnd'");
                callback(0,sessionText);
            }

        };

   //Commands execution
  
  var exec = require('child_process').exec;
  var SSH2Shell = require ('ssh2shell');
  var SSH = new SSH2Shell(hostConfig);
  
  var scpScript = "./expectScp.sh " + port + " " + commandFile + " " + user + " " + host + " " + mountPoint + " " + psw;
  exec(scpScript, function (err, stdout, stderr) {
    if (err)  {
      console.log("Could not secure copy file: "+err);
      throw new Error(err);
    }
    SSH.connect();
  });

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

            console.log(" -------- connected to consoled host -----------");

            console.log(data);

            console.log(" ---  end of data received from last consoled host ------  ");
        }
    );

}


}

module.exports = CliPlugin;
