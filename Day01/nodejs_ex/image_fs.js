var http = require('http');
var fs = require('fs');

var server = http.createServer();
server.listen(3000, function () {
    console.log('서버가 시작 되었습니다.');
});

server.on('request', function (req, res) {
    console.log('클라이언트 요청이 들어왔습니다.');

    var filename = 'YSY.png';
    fs.readFile(filename, function (err, data) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(data);
        res.end();
    });
});
