/**
 * Created by Marlon on 2017/1/10.
 */
'use strict';

var config = require('./config');
var Wechat = require('./wechat/wechat');
var wechatApi = new Wechat(config.wechat);

exports.reply = function *(next) {
    var message = this.weixin;

    if (message.MsgType === 'event') {
        console.log('事件推送');
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫二维码进来' + message.EventKey + '' + message.ticket)
            }

            this.body = '哈哈, 你订阅了这个号';
        } else if (message.Event === 'unsubscribe') {
            console.log('无情！');
            this.body = '';
        } else if (message.Event === 'LOCATION') {
            this.body = '您上报的位置是：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
        } else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单：' + message.EventKey;
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫二维码' + message.EventKey + ' ' +  message.Ticket);

            this.body = '看到扫一扫';
        } else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接：' + message.EventKey;
        }
    } else if (message.MsgType === 'text') {
        var content = message.Content;
        var replay = '老哥！你说的: ' + message.Content + '太复杂了';

        if (content === '1') {
            replay = '天下第一！';
        } else if (content === '2') {
            replay = '第二！';
        } else if (content === '3') {
            replay = '三费二三';
        } else if (content === '4') {
            replay = [{
                title: '技术特牛!',
                description: '只是个玩笑！',
                picUrl: 'http://p0.qhimg.com/t0164a5f699cf8bf70d.jpg?size=640x400',
                url: 'https.//www.baidu.com'
            }, {
                title: 'Nodejs 微信!',
                description: '只是个联系！',
                picUrl: 'http://p4.so.qhmsg.com/sdr/512_768_/t0104f38ba014554699.jpg',
                url: 'https://nodejs.org'
            }]
        } else if (content === '5') {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/saber.jpg');

            replay = {
                type:'image',
                mediaId: data.media_id
            }
        } else if (content === '6') {
            var data = yield wechatApi.uploadMaterial('video', __dirname + '/xx.mp4');

            replay = {
                type:'video',
                title: '小视频',
                description: '我不知道是什么',
                mediaId: data.media_id
            }
        } else if (content === '7') {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/saber.jpg');

            replay = {
                type:'music',
                title: '小音乐',
                description: '我不知道是什么',
                musicUrl: 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
                thumbMediaId: data.media_id
            }
        }

        this.body = replay;
    }
    yield next;
};