// node.js 프로젝트와 mongodb 연동 테스트
const http = require('http');
const express = require('express');
const app = express();

const mongojs = require("mongojs");
const db = mongojs('vehicle', ['car']);
const path = require('path');

app.set('port', 3000);
app.set('views', path.join(__dirname, "../views")); // 절대 경로 + 상대 경로
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    if(db) {
        // mongojs는 옛날 기술 - 콜백 함소로 처리해야 한다.
        db.car.find((err, result) => {
            if(err) throw err;
            req.app.render("CarList", {carList: result}, (err2, html) => {
                if(err2) throw err2;
                res.end(html);
            });
        });
    } else {
        res.end('db가 연결되지 않았습니다!');
    }
});

const server = http.createServer(app);
server.listen(app.get('port'), () =>{
    // 일체유심조 (씨크리트)
    // 백견이불여일타
    console.log(`서버 실행 중 >>> http://localhost:${app.get('port')}`);
})
