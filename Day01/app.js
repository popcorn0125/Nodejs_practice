const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.set('port', 3000);
// path대신에 __dirname을 사용해됨. __dirname은 최상위 루트를 시작으로 절대적 경로가 됨.
console.log('__dirname:', __dirname);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/", express.static(path.join(__dirname, 'public')));
app.use(cors());
// ehs 뷰 엔진에서 파라미터 확인
app.get('/home', (req, res) => {
    console.log(' /home 요청')
    const name = req.query.name;
    const age = req.query.age;
    req.app.render('home', {name, age}, (err, html)=> {
        res.end(html);
    });
});

// 브라우저 body에 JSON형식으로 바로 출력
app.get('/home2', (req, res) => {
    console.log(' /home2 요청')
    //res.send()는 객체나 수식 처리
    res.send(req.query);
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`서버 실행 중 >> http://localhost:${app.get('port')}`);
});