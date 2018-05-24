var SSH = require('simple-ssh');

var CliPlugin = function (host, user, psw) {
    var ssh = new SSH({
        host: host,
        user: user,
        pass: psw
    });
	
	ssh.exec('echo command', {
        out: function(out) {
            console.log(out);
        }
    }).start();
};

module.exports = CliPlugin;