#!/usr/bin/expect -f

set port [lindex $argv 0]
set commandFile [lindex $argv 1]
set user [lindex $argv 2]
set host [lindex $argv 3]
set password [lindex $argv 4]

spawn scp -P "$port" ./"$commandFile" "$user"@"$host":"$mountPoint":"$commandFile"
expect "*?assword:*"
send "$password\r"
