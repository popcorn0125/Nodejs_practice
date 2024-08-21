var http = require('http');
var server = http.createServer();
server.on('request', function (request, response) {
    response.end('Hello');
});
server.on('connection', function (session) {
    console.log('connection event');
    // console.log(session);
});
server.on('close', function () {
    console.log('close');
});
server.listen(3000, () => {console.log("http://localhost:3000")});
