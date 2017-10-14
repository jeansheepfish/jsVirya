"use strict";

const _ = require('lodash')
    , moment = require('moment')
    , util = require('util')
    , ucutil = require('../uc_modules/lib_util')
    , sha1 = require('sha1')
    , ucUtil = require('../uc_modules/lib_util')
    , request = require('request')
    , wechat_call = require('../uc_modules/mod_wechat_call');

// [2017-10-12 21:49:35:049] - info: {"access_token":"EaKGKR3UH6uS6nHX0l201F6lC3PPYKtXu_5CmsCY4WriZ_Rhl8Hij5qRQS4FkTw9HRJTEY4XTlnyLzEkZw4A-n18iydnM8BC6BEIJMGTzglIZ0gZPwJQJll3rdlWyc8qBEMiAHAORZ","expires_in":7200}
let access_token = 'BkJkssX2mGyKioCbvMO6fjC4cLQmDQdKOmMJBqZVd8l3unEJKiSe_LGqKZ2heLN6KExCjz7dHWxr41D-gDpc9c1crRvH8Ke0axcalAl_cA8N42Z0g4IhjR8IRTGJAJT5YVSaAJAQNK';

let open_id = 'oux1KwGR50XYgbesbfR1zohal1IQ'; //yujun
//let open_id = 'oux1KwE6iAR7ciWeJnc7d0hwCrDM'; //yangweiwei
//let open_id = 'oux1KwGC8elrmj8RE_1Cb65psilQ';//wangxiaoxia
//let open_id = 'oux1KwBQYMTFV0VvMz7kpRhxNXJU';//zhaoyan


let requestUrl;
let jsonObj ={};
let jsonStr;
let vars = {};



module.exports = function (req, res, next) {

    let api = _.get(req.params, 'api', ''); // 页面【一定存在】

    if (controller[api]) {
        controller[api](req, res, next);
    } else {
        // 继续
        next();
    }
};

let controller = {
    token: (req, res, next) => {
        let cfg = req.siteInfo;

        let site = cfg.site;
        let userInfo = req.userInfo;
        let mob = userInfo && userInfo.mobile;
        let cid = userInfo && userInfo.customerId;
        let uid = userInfo && userInfo.openId;
        let uname = (userInfo && userInfo.userName) || '';
        let from = '';
        let vars = {
            __ID__: site, // 企业码
            __WECHAT__: uid, // 微信号
            __MOBILE__: mob, // 手机
            __CUSTOMER__: cid, // 顾客ID
            __NAME__: uname, // 姓名
            __FROM__: from, // 介绍人
        };
        let url = ucutil.make_uc_domain(site, true) + `/page/home`;
        url += filter_arguments(req);

        console.log(cfg);

        //获取access_token
        let token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APPID}&secret={APPSECRET}';
        token_url = token_url.replace('{APPID}', cfg['app_id']).replace('{APPSECRET}', cfg['app_secret']);
        console.log('获取access_token');
        console.log(token_url);
        request(token_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
         })

        vars = {
            outputStr: 'token'
        };
        res.render('../views/test.html', vars);
        //res.end('token');
    },
    tag: (req, res, next) => {
        //获取公众号已创建的标签
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/tags/get?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        console.log('获取公众号已创建的标签');
        console.log(requestUrl);
        request(requestUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        });

        //获取标签下粉丝列表  //{"tags":[{"id":2,"name":"星标组","count":0}]}
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/user/tag/get?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        console.log('获取标签下粉丝列表');
        console.log(requestUrl);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify('{"tagid":100}')
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });

        //获取公众号的黑名单列表
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/tags/members/getblacklist?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        console.log('获取公众号的黑名单列表');
        console.log(requestUrl);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify('{"begin_openid":""}')
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });

        vars = {
            outputStr: 'tag'
        };
        res.render('../views/test.html', vars);
        //res.end('tag');
    },
    userinfo: (req, res, next) => {
        //获取用户列表
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token={ACCESS_TOKEN}'.replace('{ACCESS_TOKEN}', access_token);
        request(requestUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('获取用户列表');
                console.log(requestUrl);
                console.log(body);
            }
        });


        //获取用户基本信息
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token={ACCESS_TOKEN}&openid={OPENID}&lang=zh_CN'
            .replace('{ACCESS_TOKEN}', access_token)
                .replace('{OPENID}', open_id);
        request(requestUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('获取用户基本信息');
                console.log(requestUrl);
                console.log(body);
            }
        });

        //获取用户已领取卡券接口
        requestUrl = 'https://api.weixin.qq.com/card/user/getcardlist?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        jsonStr = '{"openid":"{OPENID}","card_id":""}'
            .replace('{OPENID}', open_id);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse(jsonStr)
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('获取用户已领取卡券接口');
                console.log(requestUrl);
                console.log(body)
            }
        });

        vars = {
            outputStr: 'userinfo'
        };
        res.render('../views/test.html', vars);
        //res.end('userinfo');
    },
    material: (req, res, next) => {
        //获取素材列表
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token={ACCESS_TOKEN}'.replace('{ACCESS_TOKEN}', access_token);
        console.log('获取素材列表');
        console.log(requestUrl);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },

            body: JSON.parse('{"type": "image","offset": 0,"count": 20}')
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('--------------图片（image）--------------');
                console.log(body)
            }
        });
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse('{"type": "video","offset": 0,"count": 20}')
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('--------------视频（video）--------------');
                console.log(body)
            }
        });
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse('{"type": "voice","offset": 0,"count": 20}')
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('--------------语音 （voice）--------------');
                console.log(body)
            }
        });
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse('{"type": "news","offset": 0,"count": 20}')
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('--------------图文（news）--------------');
                console.log(body)
            }
        });

        vars = {
            outputStr: 'material'
        };
        res.render('../views/test.html', vars);
        //res.end('material');
    },
    home: (req, res, next) => {

        //获取永久素材
        let get_material_url = 'https://api.weixin.qq.com/cgi-bin/material/get_material?access_token={ACCESS_TOKEN}';
        get_material_url = get_material_url.replace('{ACCESS_TOKEN}', access_token);
        request(get_material_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('获取永久素材');
                console.log(get_material_url);
                console.log(body)
            }
        })

        //获取自定义菜单配置
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token={ACCESS_TOKEN}'.replace('{ACCESS_TOKEN}', access_token);
        console.log('获取自定义菜单配置');
        console.log(requestUrl);
        request(requestUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });

        vars = {
            outputStr: 'home'
        };
        res.render('../views/test.html', vars);
        //res.end('home');
    },
    sendMessage: (req, res, next) => {
        // 客服接口-发送文本消息
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        jsonStr = '{"touser": "{OPENID}","msgtype": "text","text": {"content": "http://www.baidu.com"}}'
            .replace('{OPENID}', open_id);

        console.log('客服接口-发送文本消息');
        console.log(requestUrl);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse(jsonStr)
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });

        vars = {
            outputStr: 'sendMessage'
        };
        res.render('../views/test.html', vars);
        //res.end('sendMessage');
    },
    sendMpnews: (req, res, next) => {
        // 客服接口-发送图文消息
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        jsonStr = '{"touser": "{OPENID}","msgtype": "mpnews","mpnews": {"media_id":"Mx_ty-9FRrxp9Q8LP2qyUzYCcj1LUJtjWOcL3yNXhtg"}}'
            .replace('{OPENID}', open_id);

        console.log('客服接口-发送图文消息（点击跳转到图文消息页面）');
        console.log(requestUrl);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse(jsonStr)
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });

        vars = {
            outputStr: 'sendMpnews'
        };
        res.render('../views/test.html', vars);
        //res.end('sendMpnews');
    },
    sendWxcard: (req, res, next) => {
        // 客服接口-发送卡券
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        jsonStr = '{"touser": "{OPENID}","msgtype": "wxcard","wxcard": {"card_id":"pux1KwEcfj4ebfP6joPwR7p4SzVg"}}'
            .replace('{OPENID}', open_id);

        console.log('客服接口-发送卡券');
        console.log(requestUrl);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse(jsonStr)
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });

        vars = {
            outputStr: 'sendWxcard'
        };
        res.render('../views/test.html', vars);
        //res.end('sendWxcard');
    },
    templateSend: (req, res, next) => {
        // 發送模板消息
        requestUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={ACCESS_TOKEN}'
            .replace('{ACCESS_TOKEN}', access_token);
        jsonObj =
        {
            "touser":"{OPENID}",
            "template_id":"S_DBVnngLYUOtTivX5TU6Cnhqt50ppwVGSP-eqBAgK0",
            "url":"http://www.baidu.com",
            "data":{
                "result": {
                    "value":"result恭喜你购买成功！",
                    "color":"#173177"
                },
                "withdrawMoney":{
                    "value":"领奖金额777",
                    "color":"#173177"
                },
                "withdrawTime": {
                    "value":"领奖时间 2014年9月22日",
                    "color":"#173177"
                },
                "cardInfo": {
                    "value":" 银行信息 39.8元",
                    "color":"#173177"
                },
                "arrivedTime":{
                    "value":"到账时间 欢迎再次购买！",
                    "color":"#173177"
                },
                "remark":{
                    "value":"remarkaaa",
                    "color":"#173177"
                }
            }
        };
        jsonStr = JSON.stringify(jsonObj)
            .replace('{OPENID}', open_id);
        console.log(jsonStr);

        console.log('發送模板消息');
        console.log(requestUrl);
        request({
            url: requestUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse(jsonStr)
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });

        vars = {
            outputStr: 'templateSend'
        };
        res.render('../views/test.html', vars);
        //res.end('sendWxcard');
    }
};

// 获得有意义的url参数
function filter_arguments(req) {
    if (_.isEmpty(req.query)) {
        return '';
    }

    let args = [];
    for (let q in req.query) {
        if (['from', 'isappinstalled', 'uu_id', 'uu_date', 'uu_time'].includes(q)) continue;

        args.push(q + '=' + _.get(req.query, q, ''));
    }

    return args.length ? '?' + args.join('&') : '';
}

