// var MongoClient = require('mongodb').MongoClient;
// MongoClient.connect('mongodb://localhost', { useUnifiedTopology: true }, function (err, client) {
//     if (err) throw err;
//     var db = client.db('vehicle');
//     db.collection('car').findOne({}, function (findErr, result) {
//         if (findErr) throw findErr;
//         console.log(result.name, result.price, result.company, result.year);
//         client.close();
//     });
// });
const http = require('http');
const express = require('express');
const app = express();

app.set(('port'), 3000);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Express에서 몽고디비 사용-몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;


// 데이터베이스 객체를 위한 변수 선언
let db = null;
//데이터베이스에 연결
const connectionDB = () =>{
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017';
    // 데이터베이스 연결
    MongoClient.connect(databaseUrl, function (err, database) {
        if (err) { throw err; }
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        // database 변수에 할당할때
        // 몽고디비3 이상에서는 db명을 지정해 주어야 한다.
        db = database.db('vehicle');
    });

}

app.get('/car', (req,res) => {
    if(db!==null){
        const car = db.collection('car');
        car.find({}).toArray(function(err, carList) {
            req.app.render('car_list', {carList}, (err,html) => {
                res.end(html);
            });
        });
    }
})

const server = http.createServer(app);
server.listen(app.get('port'), () =>{
    console.log(`서버 실행 중 >>> http://localhost:${app.get('port')}`);
    connectionDB();
})
