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
        } else if (content === '8') {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/saber.jpg', {type: 'image'});

            replay = {
                type:'image',
                mediaId: data.media_id
            }
        } else if (content === '9') {
            var data = yield wechatApi.uploadMaterial('video', __dirname + '/xx.mp4', {type: 'video', description: "{'title': 'I dont know', 'introduction': 'Never give up!'}"});

            console.log(data);

            replay = {
                type:'video',
                title: '小视频',
                description: '我不知道是什么',
                mediaId: data.media_id
            }
        } else if (content === '10') {
            var picData =  yield wechatApi.uploadMaterial('image', __dirname + '/saber.jpg', {});

            var media = {
                articles: [{
                    title: '图',
                    thumb_media_id: picData.media_id,
                    author: 'Marlon',
                    digest: '这是摘要',
                    show_cover_pic: 1,
                    content: '这是内容',
                    content_source_url: 'https://github.com'
                }]
            };

            data = yield wechatApi.uploadMaterial('news', media, {});
            console.log(data.mediaId);
            data = yield wechatApi.fetchMaterial(data.media_id, 'news', {});

            console.log(data);

            var items = data.news_item;
            var news = [];

            items.forEach(function (item) {
                news.push({
                    title: item.rirle,
                    decription: item.digest,
                    picUrl: picData.url,
                    url: item.url
                })
            });
            replay = news;
        } else if (content === '11') {
            var counts = yield wechatApi.countMaterial();
            console.log(JSON.stringify(counts));

            var result = yield [
                wechatApi.batchMaterial({
                    type: 'image',
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchMaterial({
                    type: 'video',
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchMaterial({
                    type: 'voice',
                    offset: 0,
                    count: 10
                }),
                wechatApi.batchMaterial({
                    type: 'news',
                    offset: 0,
                    count: 10
                })
            ];

            console.log(JSON.stringify(result));
            replay = '1';
        } else if (content === '12') {
            var group = yield wechatApi.checkGroup('wechat');

            console.log('新分组 wechat');
            console.log(group);

            var groups = yield  wechatApi.fetchGroup();
            console.log('加了 wechat 的分组列表');
            console.log(groups);

            var group2 = yield wechatApi.checkGroup(message.FromUserName);
            console.log('查看自己的分组');
            console.log(group2);

            replay = 'group done';
        } else if (content === '13') {
            var user = yield  wechatApi.batchFetchUsers(message.FromUserName, 'en');
            console.log(user);

            var openIds = [
                {
                    openid: message.FromUserName,
                    lang: 'en'
                }
            ];
            var users = yield wechatApi.batchFetchUsers(openIds);
            console.log(users);

            replay = JSON.stringify(user);
        } else if (content === '14') {
            var userList = yield wechatApi.listUsers();
            console.log(userList);
            replay = userList.total;
        }
        this.body = replay;
    }
    yield next;
};