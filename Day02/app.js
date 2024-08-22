const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', 3000);
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static("public"));
// post 방식으로 파라미터 전달 받기 위한 설정
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const memberList = [
    { no: 101, id:'user01', password: '1234', name:'홍길동', email: 'hong@gmail.com'},
    { no: 102, id: 'user02', password: '12345', name: '김길동', email: 'kim@gmail.com' },
    { no: 103, id: 'user03', password: '123', name: '배길동', email: 'bae@gmail.com' },
    { no: 104, id: 'user04', password: '123456', name: '조길동', email: 'jo@gmail.com' },
]
let noCnt = 105;

app.get("/home", (req, res) => {
    req.app.render("home/Home", {}, (err, html) => {
        res.end(html);
    });
})

app.get('/profile', (req, res) => {
    req.app.render("profile/Profile", {}, (err, html) => {
        res.end(html);
    });
});

app.get('/member', (req, res) => {
    req.app.render("member/Member", {}, (err, html) => {
        res.end(html);
    });
});

app.get('/login', (req, res) => {
    req.app.render("member/Login", {}, (err, html) => {
        res.end(html);
    });
});

app.post('/login', (req, res) => {
    console.log(req.body.id, req.body.password);
    const idx = memberList.findIndex(member => member.id === req.body.id);
    if(idx != -1){
        if(memberList[idx].password === req.body.password){
            console.log('로그인 성공')
        } else {
            console.log('로그인 실패');
        }
    } else{
        console.log('ID가 존재하지 않습니다.')
    }
    res.redirect('/member');
});

app.get('/joinus', (req, res) => {
    req.app.render("member/Joinus", {}, (err, html) => {
        res.end(html);
    });
});

app.post('/joinus', (req, res) => {
    // 회원 가입 처리 후 목록으로 갱신
    res.redirect('/member');
});

app.get('/gallery', (req, res) => {
    req.app.render("gallery/Gallery", {}, (err, html) => {
        res.end(html);
    });
});

app.get('/shop', (req, res) => {
    req.app.render("shop/Shop", {}, (err, html) => {
        res.end(html);
    });
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=> {
    console.log(`Run on server >>> http://localhost:${app.get('port')}`);
});