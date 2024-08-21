function task1(fullfill, reject) {
    console.log('Task1 시작');
    setTimeout(function () {
        console.log('Task1 끝');
        //fullfill('Task1 결과');
        reject('Error msg');
    }, 300);
}

function fullfilled(result) {
    console.log('fullfiled : ', result);
}

function rejected(err) {
    console.log('rejected : ', err);
}

// task1은 참조만한 것이고 task1(매개변수)는 then에서 들어간다.
new Promise(task1).then(fullfilled, rejected);
