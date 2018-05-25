var SSH = require('simple-ssh');

var CliPlugin = function (host, user, psw) {
    var ssh = new SSH({
        host: host,
        user: user,
        pass: psw
    });

    this.setCommandWithIDS = function(callback) {
        createLoginWithSSH(ssh)
    }

    this.getCommandWithIDS = function(callback) {
        createLoginWithSSH(ssh)
    }
};

function createLoginWithSSH(ssh) {
    ssh.exec('echo command', {
        out: function(out) {
            console.log(out);
        }
    }).start();
}

module.exports = CliPlugin;
