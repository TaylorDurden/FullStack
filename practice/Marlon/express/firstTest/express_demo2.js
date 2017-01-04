/**
 * Created by Marlon on 2017/1/4.
 */
// 路由
/*
 * 路由决定了由谁(指定脚本)去响应客户端请求
 * 在HTTP请求中，我们可以通过路由提取出请求的URL以及GET/POST参数
 * */
var express = require('express');
var app = express();

// 主页输出 "Hello World"
app.get('/', function (req, res) {
    console.log("主页get请求");
    res.send('Hello Get');
});

// POST请求
app.post('/', function (req, res) {
    console.log("主页 POST 请求");
    res.send("Hello World");
});

// /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
    console.log("/list_user GET 请求");
    res.send('用户列表页');
});

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function (req, res) {
    console.log("/ab*cd 请求");
    res.send("正则匹配");
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});

