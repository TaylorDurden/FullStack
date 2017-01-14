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
        <p id="director"></p>
        <p id="year"></p>
        <p id="poster"></p>
        <div id="poster"></div>
        <script src="https://zeptojs.com/zepto-docs.min.js"></script>
        <script src="https://res.wx.qq.com/open/js/jweixin-1.1.0.js"></script>
        <script>
            wx.config({
                debug: false, // 开启调试模式
                appId: 'wx4e4dafb1b3c7ad08', // 必填，公众号的唯一标识
                timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
                nonceStr: '<%= noncestr %>', // 必填，生成签名的随机串
                signature: '<%= signature %>', // 必填，签名
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'previewImage',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'translateVoice'
                ] // 必填，需要使用的JS接口列表
            })

            wx.ready(function(){
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                 wx.checkJsApi({
                     jsApiList: ['onVoiceRecordEnd'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                         success: function(res) {
                         console.log(res);
                         // 以键值对的形式返回，可用的api值true，不可用为false
                         // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                     }
                 });

                 var shareContent = {
                     title: 'ssss', // 分享标题,
                     desc: '我搜出来了撒子', // 分享描述
                     link: 'https://github.com', // 分享链接
                     imgUrl: 'http://i2.hdslb.com/bfs/archive/62915c7879fb3149bd8e21fb6e3c06749b7b40b2.jpg', // 分享图标
                     type: 'link', // 分享类型,music、video或link，不填默认为link
                     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                     success: function () {
                         // 用户确认分享后执行的回调函数
                         window,alert('分享成功');
                     },
                     cancel: function () {
                         // 用户取消分享后执行的回调函数
                         window,alert('分享失败');
                     }
                 }

                 var isRecording = false;
                 var slides;
                 isRecording = false;

                 $('#poster').on('tap', function () {
                    wx.previewImage(slides);
                 })

                 $('h1').on('tap', function () {

                    if (!isRecording) {
                         isRecording = true;
                         wx.startRecord({
                             cancel: function () {
                                window.alert('那就不搜了');
                             }
                         });
                         return
                    }

                    wx.onMenuShareAppMessage(shareContent);

                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;

                             wx.translateVoice({
                                 localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                                 isShowProgressTips: 1, // 默认为1，显示进度提示
                                 success: function (res) {
                                    var result = res.translateResult;
                                    window.alert(res.translateResult); // 语音识别的结果

                                    $.ajax({
                                        type: 'get',
                                        url: '/v2/movie/search?q=' + result,
                                        dataType: 'jsonp',
                                        jsonp: 'callback',
                                        success: function(data) {
                                            var subject = data.subjects[0];

                                            $('#title').html(subject.title)
                                            $('#year').html(subject.year)
                                            $('#director').html(subject.directors[0].name)
                                            $('#poster').html('<img src="' + subject.images.large + '"/>')

                                            shareContent = {
                                                 title: subject.title, // 分享标题
                                                 desc: '我搜出来了' + subject.title, // 分享描述
                                                 link: 'https://github.com', // 分享链接
                                                 imgUrl: subject.images.large, // 分享图标
                                                 type: 'link', // 分享类型,music、video或link，不填默认为link
                                                 dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                                 success: function () {
                                                    // 用户确认分享后执行的回调函数
                                                    window,alert('分享成功');
                                                 },
                                                 cancel: function () {
                                                    // 用户取消分享后执行的回调函数
                                                    window,alert('分享失败');
                                                 }
                                             }

                                             slides = {
                                                current: subject.images.large,
                                                url: [subject.images.large]
                                             }

                                             data.subjects.forEach(function(item) {
                                                slides.urls.push(item.images.large)
                                             })

                                             wx.onMenuShareAppMessage(shareContent);
                                        }
                                    })
                                 }
                             });
                        }
                    })
                 })
            });
        </script>
    </body>
</html>
*/});
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
        var url = this.href;
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