/**
 * Created by Marlon on 2017/1/9.
 */
'use strict';

var Promise = require('bluebird');
// 对request 进行Promise化（可以使用then）
var request = Promise.promisify(require('request'));
var util = require('./util');
var fs = require('fs');
var _ = require('lodash');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
// 添加一个配置项
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    // 临时
    temporary: {
        upload: prefix + 'media/upload?',
        fetch: prefix + 'media/get?'
    },
    // 永久
    permanent: {
        // 上传图片和视频
        upload: prefix + 'material/add_material?',
        // 新增永久图文素材
        uploadNews: prefix + 'material/add_news?',
        fetch: prefix + 'material/get_material?',
        // 上传图文消息内的图片获取URL
        uploadNewsPic: prefix + 'media/uploadimg?',
        del: prefix + 'material/del_material?',
        update: prefix + 'material/update_news?',
        // 素材总数
        count: prefix + 'material/get_materialcount?',
        // 素材列表
        batch: prefix + 'material/batchget_material?'
    },
    // 分组
    group: {
        create: prefix + 'groups/create?',
        fetch: prefix + 'groups/get?',
        check: prefix + 'groups/getid?',
        update: prefix + 'groups/update?',
        move: prefix + 'groups/members/update?',
        batchupdate: prefix + 'groups/members/batchupdate?',
        del: prefix + 'groups/delete?'
    },
    user: {
        remark: prefix + 'user/info/updateremark?',
        fetch: prefix + 'user/info?',
        batch: prefix + 'user/info/batchget?',
        list: prefix + 'user/get?'
    }
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

//material:如果是图文，就是数组；如果是图片或者是视频，就是字符串类型的路径
//第二个参数是素材，只要传了第三个参数，说明就是永久素材
Wechat.prototype.uploadMaterial = function (type, material, permanent) {

    var that = this;
    var form = {};
    var uploadUrl = api.temporary.upload;

    if (permanent) {
        uploadUrl = api.permanent.upload;
        // 继承permanent 对象
        _.extend(form, permanent);
    }

    if (type === 'pic') {
        uploadUrl = api.permanent.uploadNewsPic;
    }

    if (type === 'news') {
        uploadUrl = api.permanent.uploadNews;
        form = material;
    } else {
        form.media = fs.createReadStream(material);
    }

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = uploadUrl + 'access_token=' + data.access_token;

                if (!permanent) {
                    url += '&type=' + type;
                } else {
                    form.access_token = data.access_token;
                }

                // 上传的参数
                var options = {
                    method: 'POST',
                    url: url,
                    json: true
                };

                if (type === 'news') {
                    options.body = form;
                } else {
                    options.formData = form;
                }

                request(options).then(function (response) {
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

// 获取素材
Wechat.prototype.fetchMaterial = function (mediaId, type, permanent) {

    var that = this;
    var fetchUrl = api.temporary.fetch;

    if (permanent) {
        fetchUrl = api.permanent.fetch;
    }

    return new Promise(function (resolve, reject) {
        that
            .fetchAccessToken()
            .then(function (data) {
                var url = fetchUrl + 'access_token=' + data.access_token + '&media_id=' + mediaId;
                var form = {};
                var options = {method: 'POST', url: url, json: true};

                if (permanent) {
                    form.media_id = mediaId;
                    form.access_token = data.access_token;
                    options.body = form;
                } else {
                    if (type === 'video') {
                        url = url.replace('https://', 'http://');
                    }
                    url += '&media_id=' + mediaId;
                }
                if (type === 'news' || type === 'video') {
                    request(options).then(function (response) {
                    var _data = response.body;

                        if (_data) {
                            resolve(_data);
                        } else {
                            throw new Error('fetch material fails');
                        }
                    })
                    .catch(function (err) {
                        reject(err);
                    });
                } else {
                    resolve(url);
                }
            })
    });
};

// 删除素材
Wechat.prototype.deleteMaterial = function (mediaId) {

    var that = this;
    var form = {
        media_id: mediaId
    };

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.permanent.del + 'access_token=' + data.access_token + '&media_id=' + mediaId;

                request({method: 'POST', url: url, body:form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('delete material fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Wechat.prototype.updateMaterial = function (mediaId, news) {

    var that = this;
    var form = {
        media_id: mediaId
    };

    _.extend(form, news);

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.permanent.update + 'access_token=' + data.access_token + '&media_id=' + mediaId;

                request({method: 'POST', url: url, body:form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('update material fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Wechat.prototype.countMaterial = function () {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.permanent.update + 'access_token=' + data.access_token + '&media_id=' + mediaId;

                request({method: 'GET', url: url, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('count material fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Wechat.prototype.batchMaterial = function (options) {

    var that = this;

    options.type = options.type || 'image';
    options.offset = options.offset || 0;
    options.count = options.count || 1;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.permanent.batch + 'access_token=' + data.access_token + '&media_id=' + mediaId;

                request({method: 'POST', url: url, body: options, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('update material fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

// 添加分组
Wechat.prototype.createGroup = function (name) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.group.create + 'access_token=' + data.access_token;
                var form = {
                    group:{
                        name: name
                    }
                };

                request({method: 'POST', url: url, body: form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('create group fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

// 获取分组
Wechat.prototype.fetchGroup = function (name) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.group.fetch + 'access_token=' + data.access_token;

                request({ url: url, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('fetch group fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Wechat.prototype.checkGroup = function (openId) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.group.check + 'access_token=' + data.access_token;
                var form = {
                    openId: openId
                };

                request({method: 'POST', url: url, body: form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('check group fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

// 跟新分组
Wechat.prototype.updateGroup = function (id, name) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.group.update + 'access_token=' + data.access_token;
                var form = {
                    group: {
                        id: id,
                        name: name
                    }
                };

                request({method: 'POST', url: url, body: form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('update group fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

// 批量/移动分组
Wechat.prototype.moveGroup = function (openIds, to) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url;
                var form = {
                    to_groupid: to
                };

                if (_.isArray(openIds)) {
                    url = api.group.batchupdate + 'access_token=' + data.access_token;
                    form.openid_list = openIds
                } else {
                    url = api.group.move + 'access_token=' + data.access_token;
                    form.openid = openIds
                }

                var form = {
                    openid_list: openIds,
                    to_groupid: to
                };

                request({method: 'POST', url: url, body: form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('move group fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Wechat.prototype.deleteGroup = function (id) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.group.del + 'access_token=' + data.access_token;
                var form = {
                    group: {
                        id: id
                    }
                };

                request({method: 'POST', url: url, body: form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('delete group fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Wechat.prototype.remarkUser = function (openId, remark) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.user.remark + 'access_token=' + data.access_token;
                var form = {
                    group: {
                        openid: openId,
                        remark: remark
                    }
                };

                request({method: 'POST', url: url, body: form, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('remark User fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

// 批量/单个获取信息
Wechat.prototype.batchFetchUsers = function (openIds, lang) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var options = {
                    json: true
                };
                lang = lang || 'zh_CN';

                if (_.isArray(openIds)) {
                    options.url = api.user.batch + 'access_token=' + data.access_token;
                    options.body = {
                        user_list: openIds
                    };
                    options.method = 'POST'
                } else {
                    options.url = api.user.fetch + 'access_token=' + data.access_token + '&openid=' + openIds + '&lang=' + lang;
                }

                request(options).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('Batch or Fetch User fails');
                    }
                })
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

// 获取关注用户列表
Wechat.prototype.listUsers = function (openId) {

    var that = this;

    return new Promise(function (resolve, reject) {

        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.user.list + 'access_token=' + data.access_token;
                if (openId) {
                    url += '&next_openid=' + openId;
                }

                request({method: 'GET', url: url, json: true}).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    } else {
                        throw new Error('List User fails');
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