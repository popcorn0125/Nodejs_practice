const http = require('http');
const express = require('express');
const app = express();

app.set('port', 3000);


app.use((req, res, next ) => {
    // 전체 요청에 적용 될 한글 처리 가능
    res.writeHead(200, {"content-Type": "text/html; charset=UTF-8"});
    console.log('전체 미들웨어 호출');
    // res.end("<h1>Hello node.js</h1>");
    next();
});

app.use('/', (req, res, next) => {
    console.log(' / 요청 미들웨어')
    next();
})


app.get('/', (req,res) => {
    console.log(' / 요청')
    res.end('<h1>안녕하세요</h1>');
})

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`서버 실행 중 >> http://localhost:${app.get('port')}`);
});