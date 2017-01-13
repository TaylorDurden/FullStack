/**
 * Created by Marlon on 2017/1/5.
 */
'use strict';

var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var config = require('./config');
var reply = require('./wx/reply');
var Wechat = require('./wechat/wechat');

var app = new Koa();

var ejs = require('ejs');
var heredoc = require('heredoc');
var crypto = require('crypto');

var tpl = heredoc(function () {/*
<!DOCTYPE html>
<html>
    <head>
        <title>搜电影！</title>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1"
    </head>
    <body>
        <h1>点击标题，开始录音翻译</h1>
        <p id="title"></p>
        <div id="poster"></div>
        <script src="http://zeptojs.com/zepto-docs.min.js"></script>
        <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
        <script>
            wx.config({
                debug: true, // 开启调试模式
                appId: 'wx4e4dafb1b3c7ad08', // 必填，公众号的唯一标识
                timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
                nonceStr: '<%= noncestr %>', // 必填，生成签名的随机串
                signature: '<%= signature %>', // 必填，签名
                jsApiList: [
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'translateVoice'
                ] // 必填，需要使用的JS接口列表
            })
        </script>
    </body>
</html>
*/});
''
// 生成随机字符串
var createNoce = function () {
  return Math.random().toString(36).substr(2, 15)
};

// 获得当前时间戳
var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000, 10) + ''
};

var _sign = function (noncestr, ticket, timestamp, url) {
    var params = [
        'noncestr=' + noncestr,
        'jsapi_ticket=' + ticket,
        'timestamp=' + timestamp,
        'url=' + url
    ];
    // 下面是固定写法
    var str = params.sort().join('&');
    var shasum = crypto.createHash('sha1');

    shasum.update(str);

    return shasum.digest('hex');
};

// 生成签名算法
function sign(ticket, url) {
    var noncestr = createNoce();
    var timestamp = createTimestamp();
    var signature = _sign(noncestr, ticket, timestamp, url);
    return {
        noncestr: noncestr,
        timestamp: timestamp,
        signature: signature
    }
}

app.use(function *(next) {
    if (this.url.indexOf('/movie') > -1) {
        var wechatApi = new Wechat(config.wechat);
        var data = yield wechatApi.fetchAccessToken();
        var access_token = data.access_token;
        var ticketData = yield wechatApi.fetchTicket(access_token);
        // 拿到授权的票据
        var ticket = data.ticket;
        // 完整的路径
        var url = this,href;
        var params = sign(ticket, url);

        console.log('params');
        console.log(params);

        // 把参数传入tpl 模板里面
        this.body = ejs.render(tpl, params);

        return next;
    }
    yield next;
});
app.use(wechat(config.wechat, reply.reply));

app.listen(1234);
console.log('listening: 1234');