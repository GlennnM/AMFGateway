# AMFGateway
Re-creation of AMF save system gateway for Ninja Kiwi games. WIP.

To download (**DO NOT use the 'download zip' feature in github browser; it doesn't include submodules**):

`git clone --recursive https://github.com/GlennnM/AMFGateway/`

then run 'amf.bat' or 'amf.sh' depending on your system. JDK 21 and maven are required.

The server will start on port 8080 and you can access the gateway at /gateway.

Sending a GET request will show some AMF parsing on test data; a POST request will respond through different methods in the gateway which currently consist of stubbed code.


## TODO

- account creation with database/object store?
- mod integration for archive to allow login
- implement the actual commands(src/webapp/AMF.jsp) with SQL statements or whatever else idk
- save transfer/download support?(ideally allow player to switch between NK, hydar, and local saves)
- (see save.zip for something slightly close to above but also unfinished)
- bmc server??
- fortress destroyer and TK(api.ninjakiwi.com recreation + more archive modding needed)
- wheel of fate, profiles, leaderboards, battles stats, ...
