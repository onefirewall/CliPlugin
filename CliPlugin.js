IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/g;

var SSH = require('simple-ssh');

var CliPlugin = function (host, user, psw) {
    var ssh = new SSH({
        host: host,
        user: user,
        pass: psw
    });

    this.addIpList = function(ipList, callback) {
        getRootAccess(ssh);
        getConfigAccess(ssh);
        blockIPs(ssh, ipList);
        exit(ssh);
        exit(ssh);
    }

    this.removeIpList = function(ipList, callback) {
        getRootAccess(ssh);
        getConfigAccess(ssh);
        enableIPs(ssh, ipList);
        exit(ssh);
        exit(ssh);
    }
};

function getRootAccess(ssh) {
    ssh.exec('enable', {
        out: function(out) {
            console.log(out);
        }
    }).start();
}

function getConfigAccess(ssh) {
    ssh.exec('configure terminal', {
        out: function(out) {
            console.log(out);
        }
    }).start();
}

function blockIPs(ssh, ipList) {
    for (i = 0; i < ipList.length; i++) {
        if(ipList[i].match(IP_REGEX)) {
            ssh.exec('access-list 200 deny ipList[i]', {
            out: function(out) {
                    console.log(out);
                }
            }).start();
        }
    }
}

function enableIPs(ssh, ipList) {
    for (i = 0; i < ipList.length; i++) {
        if(ipList[i].match(IP_REGEX)) {
            ssh.exec('access-list 200 permit ipList[i]', {
            out: function(out) {
                    console.log(out);
                }
            }).start();
        }
    }
}

function exit(ssh) {
    ssh.exec('exit', {
        out: function(out) {
            console.log(out);
        }
    }).start();
}

module.exports = CliPlugin;
