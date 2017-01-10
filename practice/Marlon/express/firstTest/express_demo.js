/**
 * Created by Marlon on 2017/1/4.
 */
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello world');
});

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    // http://127.0.0.1:8081
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});


