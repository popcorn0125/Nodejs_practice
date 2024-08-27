const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
// 파일 업로드용 미들웨어
const multer = require('multer');
const fs = require('fs');

app.set('port', 3000);
app.set('views', 'views');
app.set('view engine', 'ejs');

// multer 업로드 설정
// multer 미들웨어 사용: 미들웨어 사용 순서 
// body-parser -> multer -> router 순으로 실행
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        // 한글 파일 깨짐 방지
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        // 파일명 중복을 방지하기 위한 처리
        // Date.now() <-- 타임스템프
        let index = fileName.lastIndexOf(".");
        let newFileName = fileName.substring(0, index);
        newFileName += Date.now();
        newFileName += fileName.substring(index);
        callback(null, newFileName);

    }
});

// 파일 제한: 10개, 1G 이하
var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024 // 1GB
    }
});

app.use(express.static("public"));
app.use('/uploads', express.static("uploads"));
// post 방식으로 파라미터 전달 받기 위한 설정
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// 쿠키 사용 미들웨어 설정
app.use(cookieParser());
// 세션 사용 미들웨어 설정
app.use(expressSession({
    secret: 'my Key',
    resave: true,
    saveUninitialized: true
}));

// 임시 데이터
// 회원 목록
const memberList = [
    { no: 101, id:'user01', password: '1234', name:'홍길동', email: 'hong@gmail.com'},
    { no: 102, id: 'user02', password: '12345', name: '김길동', email: 'kim@gmail.com' },
    { no: 103, id: 'user03', password: '123', name: '배길동', email: 'bae@gmail.com' },
    { no: 104, id: 'user04', password: '123456', name: '조길동', email: 'jo@gmail.com' },
]
let noCnt = 105;

// 쇼핑 상품 목록
const carList = [
    { _id: 111, 
        name: 'SM5', 
        price: 3000, 
        year: 1999, 
        company: 'SAMSUNG', 
        photos: [
            {
                originalname: 'sm5.png',
                filename: 'sm5.png',
                filesize: 42800,
                mimetype: 'img/png',
            },
            {
                originalname: 'sm5_in.png',
                filename: 'sm5_in.png',
                filesize: 72200,
                mimetype: 'img/png',
            }
        ],
        writedate : ''
    },

]
let carSeq = 112;

// 요청 라우팅 사용
const router = express.Router();


router.route('/home').get((req,res) => {
    req.app.render("home/Home", {}, (err, html) => {
        res.end(html);
    });
})


router.route('/profile').get((req, res) => {
    req.app.render("profile/Profile", {}, (err, html) => {
        res.end(html);
    });
});


router.route('/member').get((req, res) => {
    // 로그인이 되어 있다면 member 페이지를 보여준다.
    // 쿠키는 사용자쪽에 전달(res), 세션은 브라우저 요청에 생성(req)
    if(req.session.user !== undefined) {
        const user = req.session.user;
        req.app.render("member/Member", {user}, (err, html) => {
            res.end(html);
        });
    } else {
        res.redirect('/login');
    }
});


router.route('/login').get((req, res) => {
    req.app.render("member/Login", {}, (err, html) => {
        // 사용자(접속자)의 로컬에 쿠키가 저장 된다.
        res.cookie('user', {
            id: 'Testuser',
            name: '테스트 유저',
            authorized: true
        });
        res.end(html);
    });
});


router.route('/login').post((req, res) => {    
    console.log(req.body.id, req.body.password);
    const idx = memberList.findIndex(member => member.id === req.body.id);
    if(idx != -1){
        if(memberList[idx].password === req.body.password){
            console.log('로그인 성공');
            // 세션에 로그인 정보를 남기기
            req.session.user = {
                id : req.body.id,
                name : memberList[idx].name,
                email : memberList[idx].email,
                no : memberList[idx].no
            };
            res.redirect('/member');
        } else {
            console.log('로그인 실패');
            res.redirect('/login');
        }
    } else{
        console.log('ID가 존재하지 않습니다.')
    }
});

router.route('/logout').get((req, res)=>{
    console.log('GET - /logout 호출');
    // 로그인 된 상태라면 로그아웃
    if(!req.session.user) {
        console.log('아직 로그인 전 상태.');
        res.redirect('/login');
        return;
    }
    // 세션의 user 정보를 로그아웃 처리
    req.session.destroy((err)=>{
        if(err) throw err;
        console.log('로그아웃 완료!');
        res.redirect('/login');
    });
});


router.route('/joinus').get((req, res) => {
    req.app.render("member/Joinus", {}, (err, html) => {
        res.end(html);
    });
});


router.route('/joinus').post((req, res) => {
    // 회원 가입 처리 후 목록으로 갱신
    res.redirect('/member');
});


router.route('/gallery').get((req, res) => {
    req.app.render("gallery/Gallery", {}, (err, html) => {
        res.end(html);
    });
});

// ---- 쇼핑몰 기능
router.route('/shop').get((req, res) => {
    req.app.render("shop/Shop", {carList}, (err, html) => {
        if(err) throw err;
        res.end(html);
    });
});

router.route('/shop/insert').get((req, res) => {
    req.app.render("shop/Insert", {}, (err, html) => {
        res.end(html);
    });
});

router.route('/shop/insert').post(upload.array('photo',1), (req, res) => {
    // 구조분해 할당으로 body의 파라미터를 꺼낸다.
    const { name, price, year, company } = req.body;
    const newCar = {
        _id: carSeq++, name, price, year, company,
        writedate: Date.now(),
        photos: []
    };
    newCar.photos = req.files;
    carList.push(newCar);
    ///res.send(carList);
    res.redirect('/shop');

    // 파일 업로드 기능 추가
    // try {
    //     var files = req.files;

    //     console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
    //     console.dir(req.files[0]);
    //     console.dir('#=====#')

    //     let newphotos = [];
    //     // 현재의 파일 정보를 저장할 변수 선언
    //     let originalname = '',
    //         filename = '',
    //         mimetype = '',
    //         size = 0;

    //     if (Array.isArray(files)) {
    //         // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
    //         console.log("배열에 들어있는 파일 갯수 : %d", files.length);

    //         // files의 요소가 여러개이면 반복
    //         for (var index = 0; index < files.length; index++) {
    //             let newP = {
    //                 originalname : files[index].originalname,
    //                 filename : files[index].filename,
    //                 mimetype : files[index].mimetype,
    //                 size : files[index].size
    //             };
    //             newphotos.push(newP);
    //         } // end of  for
    //     } else {
    //         // else  부분 계속 이어서 작성 ....
    //         // 배열에 들어가 있지 않은 경우 (현재 설정에서는 해당 없음)
    //         console.log("파일 갯수 : 1 ");

    //         let newP = {
    //             originalname: files[index].originalname,
    //             filename: files[index].filename,
    //             mimetype: files[index].mimetype,
    //             size: files[index].size
    //         };
    //         newphotos.push(newP);
    //     } // end  of  if~else

    //     console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);

    //     // 새로운 car 정보 저장
    //     var d = new Date();
    //     const currentDate =  d.getFullYear() + "년 " + (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + d.getHours() + "시 " + d.getMinutes() + "분 ";
    //     const newCarInfo = {
    //         _id: noCnt++,
    //         name: req.body.name,
    //         price: req.body.price,
    //         year: req.body.year,
    //         company: req.body.company,
    //         photos : newphotos,
    //         writedate: currentDate
    //     }
    //     carList.push(newCarInfo);
        
    //     res.redirect('/shop');

    // } catch (err) {
    //     console.dir(err.stack);
    //     res.end('File upload error!');
    // }
});

router.route('/shop/modify').get((req, res) => {
    const _id = parseInt(req.query._id);
    const idx = carList.findIndex(car => _id === car._id);
    if (idx === -1) {
        console.log('상품이 존재 하지 않습니다.');
        res.redirect('/shop');
        return;
    }
    req.app.render("shop/Modify", { car: carList[idx] }, (err, html) => {
        if (err) throw err;
        res.end(html);
    });
});

router.route('/shop/modify').post((req, res) => {
    const idx = carList.findIndex(car => req.body._id === car._id);
    const newCar = {
        _id: req.body._id, 
        name: req.body.name, 
        price: req.body.price, 
        year: req.body.year, 
        company: req.body.company

    }
    carList[idx] = newCar;
    // console.log('POST - /shop/modify 호출');
    // console.dir(req.body);
    res.redirect('/shop');
});

router.route('/shop/detail').get((req, res) => {
    const _id = parseInt(req.query._id);
    const idx = carList.findIndex(car => _id === car._id);
    if(idx === -1) {
        console.log('상품이 존재 하지 않습니다.');
        res.redirect('/shop');
        return;
    }
    req.app.render("shop/Detail", {car: carList[idx]}, (err, html) => {
        if(err) throw err;
        res.end(html);
    });
});

router.route('/shop/delete').get((req, res) => {
    req.app.render("shop/Delete", {}, (err, html) => {
        res.end(html);
    });
});

router.route('/shop/cart').get((req, res) => {
    req.app.render("shop/Cart", {}, (err, html) => {
        res.end(html);
    });
});



//router 설정 맨 아래에 미들웨어 등록 
app.use('/', router);

// 등록되지 않은 패스에 대해 페이지 오류 응답
// app.all('*', function (req, res) {
//     res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>')
// });
//오류 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');
//모든 라우터 처리 후 404 오류 페이지 처리
const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// 서버 실행
const server = http.createServer(app);
server.listen(app.get('port'), ()=> {
    console.log(`Run on server >>> http://localhost:${app.get('port')}`);
});