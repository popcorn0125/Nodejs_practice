function task1(fullfill, reject) {
    console.log('1 Task1 시작');
    let num = 0;
    setTimeout(function () {
        num = 1004;
        fullfill({data : '3 Task1 결과', num});
    }, 300);
    console.log('2 Task1 끝', num);
}

function fullfilled(result) {
    console.log('fullfiled 함수 : ', result.data, result.num);
}

function rejected(err) {
    console.log('rejected : ', err);
}

new Promise(task1).then(fullfilled, rejected);