/**
 * Created by Marlon on 2017/1/5.
 */
'use strict';

var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat.txt');

var config = {
    wechat: {
        appID: 'wx4e4dafb1b3c7ad08',
        appSecret: '5358f2bc1d584b1da1da2575bbc4c414',
        token: 'marlonwebchattest',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        }
    }
};

var app = new Koa();

app.use(wechat(config.wechat));

app.listen(1234);
console.log('listening: 1234');