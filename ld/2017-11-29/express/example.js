var express = require('express');
var app = express();
var debug = require('debug')('ago');
app.use(function (req, res, next) {
    debug('log: inside here');
    req.info = req.mid + '-top';
    next();
});
app.use(function (req, res, next) {
    debug('log: inside here');
    req.mid = req.info + '-mid';
    next();
});

app.get('/', function (req, res) {
    res.write(req.info+'\n');
    res.write(req.mid+'\n');
    res.send('Hello World\n');
});

app.get('/hello', function (req, res) {
    res.write(req.info+'\n');
    res.write(req.mid+'\n');
    res.send('Hello Panda\n');
});
app.listen(3000);
