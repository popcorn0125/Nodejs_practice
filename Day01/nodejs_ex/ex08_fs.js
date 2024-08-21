var fs = require('fs');

var msg = 'Hello World!';

//파일에 데이터를 쓴다.
fs.writeFile('./data2.txt', msg, function (err) {
    if (err) {
        console.log('Error : ' + err);
    }
    console.log('data2.txt 파일에 데이터 쓰기 완료!');
});
