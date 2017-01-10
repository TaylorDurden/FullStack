/**
 * Created by Marlon on 2017/1/9.
 */
'use strict';

var Promise = require('bluebird');
// 对request 进行Promise化（可以使用then）
var request = Promise.promisify(require('request'));
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
// 添加一个配置项
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
};

// 生成实例 并且进行初始化的工作
function Wechat(opts) {
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

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
        })
}

// 检查票据合法性
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }

    // 拿到票据
    var access_token = data.access_token;
    // 拿到过期时间
    var expires_in = data.expires_in;
    // 拿到当前时间
    var now = (new Date().getTime());

    if (now < expires_in) {
        return true;
    } else {
        return false
    }
};

// 对票据进行更新
Wechat.prototype.updataAccessToken = function () {
    var appID = this.appID;
    var appSecret = this.appSecret;
    // 请求票据的地址
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;

    return new Promise(function (resolve, reject) {
        // request 就是向某一个服务器发送请求
        request({url: url, json: true}).then(function (response) {
            var data = response.body;
            var now = (new Date().getTime());
            var expires_in = now + (data.expires_in - 20) * 1000;

            data.expires_in = expires_in;

            resolve(data);
        })
    });
};

module.exports = Wechat;