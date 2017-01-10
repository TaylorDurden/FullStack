/**
 * Created by Marlon on 2017/1/9.
 */
'use strict';

var Promise = require('bluebird');
// 对request 进行Promise化（可以使用then）
var request = Promise.promisify(require('request'));
var util = require('./util');
var fs = require('fs');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
// 添加一个配置项
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    upload: prefix + 'media/upload?'
};

// 生成实例 并且进行初始化的工作
function Wechat(opts) {
    console.log('wechat 实例生成');
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function (data) {

    var that = this;
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this);
        }
    }

    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data);
            } catch(e)  {
                return that.updataAccessToken();
            }

            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data);
            } else {
                return that.updataAccessToken();
            }
        })
        .then(function (data) {
            that.access_token = data.access_token;
            that.expires_in = data.expires_in;

            that.saveAccessToken(data);
            return Promise.resolve(data);
        })
};

// 检查票据合法性
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        console.log("不合法票据");
        return false;
    }

    console.log('合法票据');
    // 拿到票据
    var access_token = data.access_token;
    // 拿到过期时间
    var expires_in = data.expires_in;
    // 拿到当前时间
    var now = (new Date().getTime());

    return now < expires_in;
};

// 对票据进行更新
Wechat.prototype.updataAccessToken = function () {

    console.log('票据更新');
    var appID = this.appID;
    var appSecret = this.appSecret;
    // 请求票据的地址
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;

    return new Promise(function (resolve, reject) {
        // request 就是向某一个服务器发送请求
        request({url: url, json: true}).then(function (response) {
            var data = response.body;
            var now = (new Date().getTime());
            data.expires_in = now + (data.expires_in - 20) * 1000;

            resolve(data);
        })
    });
};

Wechat.prototype.uploadMaterial = function (type, filepath) {

    var that = this;
    var form = {
        media: fs.createReadStream(filepath)
    };

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.upload + 'access_token=' + data.access_token + '&type=' + type;

                request({method: 'POST', url: url, formData:form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('upload material fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Wechat.prototype.reply = function () {
    var content = this.body;
    var message = this.weixin;
    var xml = util.tpl(content, message);

    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
};

module.exports = Wechat;