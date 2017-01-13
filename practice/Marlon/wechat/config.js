/**
 * Created by Marlon on 2017/1/10.
 */
var path = require('path');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat.txt');
var wechat_ticket_file = path.join(__dirname, './config/wechat_ticket.txt');

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
        },
        getTicket: function () {
            return util.readFileAsync(wechat_ticket_file);
        },
        saveTicket: function (data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_ticket_file, data);
        }
    }
};

module.exports = config;