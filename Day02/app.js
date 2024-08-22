const http = require('http');
const express = require('express');
const app = express();

app.set('port', 3000);
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/home', (req, res) => {
    req.app.render("Home", {}, (err, html) => {
        res.end(html);
    })
})

const server = http.createServer(app);
server.listen(app.get('port'), ()=> {
    console.log(`Run on server >>> http://localhost:${app.get('port')}`);
});