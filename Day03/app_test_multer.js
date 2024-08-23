const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
//Exress의 미들웨어 불러오기
const bodyParser = require('body-parser');
// 파일 업로드용 미들웨어
const multer = require('multer');
const fs = require('fs');


app.set('port', 3000);

// 파일 업로드는 post 방식으로 전송 됨.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// 외부 접속 가능하도록 static 설정.
app.use(express.static('public'));
app.use(express.static('upload'));

// multer 업로드 설정
// multer 미들웨어 사용: 미들웨어 사용 순서 
// body-parser -> multer -> router 순으로 실행
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        // 파일명 중복을 방지하기 위한 처리
        // Date.now() <-- 타임스템프
        let index = file.originalname.lastIndexOf(".");
        let newFileName = file.originalname.substring(0, index);
        newFileName += Date.now();
        newFileName += file.originalname.substring(index);
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



router.route('/process/photo').post(upload.array('photo', 1), (req,res)=> {
    console.log(' POST - /process/photo 호출');
    try {
        var files = req.files;

        console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#')

        // 현재의 파일 정보를 저장할 변수 선언
        let originalname = '',
            filename = '',
            mimetype = '',
            size = 0;

        if (Array.isArray(files)) {
            // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
            console.log("배열에 들어있는 파일 갯수 : %d", files.length);

            // files의 요소가 여러개이면 반복
            for (var index = 0; index < files.length; index++) {
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            } // end of  for
        } else {
            // else  부분 계속 이어서 작성 ....
            // 배열에 들어가 있지 않은 경우 (현재 설정에서는 해당 없음)
            console.log("파일 갯수 : 1 ");

            originalname = files[index].originalname;
            filename = files[index].name;
            mimetype = files[index].mimetype;
            size = files[index].size;
        } // end  of  if~else

        console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);

        // 클라이언트에 응답 전송
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h3>파일 업로드 성공</h3>');
        res.write('<hr/>');
        res.write('<p>원본 파일명 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
        res.write('<p>MIME TYPE : ' + mimetype + '</p>');
        res.write('<p>파일 크기 : ' + size + '</p>');
        res.end();

    } catch (err) {
        console.dir(err.stack);
        res.end('File upload error!');
    }
});



app.use('/', router);

const server = http.createServer(app);
server.listen(app.get('port'), () =>{
    console.log(`서버 실행 중 >>> http://localhost:${app.get('port')}`);
})