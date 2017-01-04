/**
 * Created by Marlon on 2017/1/4.
 */
// 我们可以使用中间件向 Node.js 服务器发送 cookie 信息
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());

app.get('/', function (req, res) {
    console.log("Cookies: ", req.cookies);
});

var servers = app.listen(8081, function () {
    var port = servers.address().port;

    console.log("启动port: %s", port);
});
