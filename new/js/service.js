function aaa() {
    $.ajax({
        async: false,
        url: 'http://192.168.2.234/tp/5/index.php/index/ajax/index',
        type: 'post',
        data: { name: 'name' },
        dataType: 'jsonp',
        jsonp: 'myname',
        jsonpCallback: 'myback'
    }).done(function(data) {
        console.info(data);
    });
}

var service = {
    url: {},
    $dom: {
        $inputArea: {},
        $msgLayout: {},
    },
    user: {
        name: '我自己'
    },
    getTimer: '',
    countdownTimer: '',
    countdownTime: 5, //倒计时时间 单位秒
    // countdownTime: 30, //倒计时时间 单位秒
    outTimer: '',
    // outTime: 0.2, //超过outTime分钟用户不发消息，停止请求消息。
    outTime: 10, //超过outTime分钟用户不发消息，停止请求消息。
    getTime: 1000, //请求消息时间间隔 单位毫秒
    isLogin: false,
    ajaxBase: {},
    base: {
        hotKey: 'ctrl+enter'
    },
    countdownDom: '<div class="countdown"></div>',
    msgUnitSend: '<div class="msg-unit msg-send"><div class="l-table l-align-middle"><div class="l-table-cell l-align-right"><span class="time">----</span><span class="name">---</span></div></div><div class="l-table"><div class="l-table-cell status"><div title="重新发送" class="error"></div></div><div class="l-table-cell content"><div class="msg"></div></div><div class="l-table-cell style"></div><div class="l-table-cell user"><div class="userImg"></div></div></div></div>',
    msgUnitGet: '<div class="msg-unit"><div class="l-table"><div class="l-table-cell"><span class="name">在线客服</span><span class="time">----</span></div></div><div class="l-table"><div class="l-table-cell user"><div class="userImg"></div></div><div class="l-table-cell style msg-get"></div><div class="l-table-cell content"><div class="msg">asdasfd</div></div><div class="l-table-cell status"><div title="重新发送" class="error"></div></div></div></div>',
    init: function() {
        if (!ceshi) return;
        var $layout = $('.service-layout'),
            $window = $(window),
            $head = $('.head', $layout),
            $close = $('.close', $head),
            $submit = $('.msg-submit', $layout);
        service.$dom.$inputArea = $('.inputArea', $layout);
        service.$dom.$msgLayout = $('.msgLayout', $layout);
        // 基本设置
        $layout.drag({
            $target: $head,
        });
        service.user.name = service.user.name;
        $layout.show();
        $layout.css({
            top: ($window.height() - $layout.height()) / 2,
            left: ($window.width() - $layout.width()) / 2,
        }).hide();
        service.url = $.zJSON($layout.attr('data-option'));
        // 事件注册
        $('.service-float').show().on({
            click: function() {
                //                判断是否模拟登录已
                if (service.isLogin) {
                    if ($layout.is(':visible')) $layout.hide();
                    else $layout.show();
                    service.$dom.$inputArea.focus();
                } else {
                    service.autoLogin();

                }

            }
        });
        $('.service-float').drag({
            callBack: function(_$float) {
                // console.info(1);
                _$float.css({
                    left: 'auto',
                    right: _$float.css('right')
                });
                _$float.animate({
                    right: '0'
                }, 100);
            }
        });


        $close.on({
            click: function() {
                $layout.hide();
            }
        });
        $submit.on({
            click: function() {
                service.sendMsg();
                //                service.getMsg();
            }
        });
        $('.submit-select').on({
            click: function() {
                $(this).find('.l-table-collapse').show();
            },
            mouseleave:function(){
                $(this).find('.l-table-collapse').hide();

            }
        });
        // 设置快捷键
        $('.submit-layout .l-table-row').each(function(i, el) {
            var $this = $(this);
            $this.on({
                click: function() {
                    $this.addClass('select').siblings().removeClass('select');
                    if (i == 0) service.base.hotKey = 'enter';
                    else service.base.hotKey = 'ctrl+enter';
                    service.$dom.$inputArea.focus();
                }
            });
        });
        $('.submit-layout .l-table-collapse').on({
            mouseleave: function() {
                $(this).hide();
            }
        });
        // 注册快捷键
        service.$dom.$inputArea.on({
            keydown: function(e) {
                if (e.keyCode == 13 && e.ctrlKey && service.base.hotKey == 'ctrl+enter') {
                    $('.msg-submit').click();
                    //                    console.info('ctrl+enter提交了');
                } else if (e.keyCode == 13 && !e.ctrlKey && service.base.hotKey == 'enter') {
                    $('.msg-submit').click();
                    //                    console.info('enter提交了');
                } else if (e.keyCode == 13 && e.ctrlKey && service.base.hotKey == 'enter') {
                    service.$dom.$inputArea.insertAtCaret('<br>');
                }
            }
        });
        //        重新发送
        service.$dom.$msgLayout.on({
            click: function() {
                //                console.info('重发消息');
                var $this = $(this);
                //                console.info($this);
                //                console.info($this.closest('.msg-unit').find('.content').html());
                service.sendMsg($this.closest('.msg-unit'));
                $this.hide();
            }
        }, '.error');
    },
    autoLogin: function() {
        service.insertMsg('欢迎使用在线客服功能！');
        var $layout = $('.service-layout');
        //                    尝试模拟登录
        //                            未登录，请求模拟登录
        /**/
        $.ajax({
            url: service.url.autoLogin,
            type: 'post',
            dataType: 'json',
            cache: false
        }).done(function(_data) {
            //                                缓存result数据
            var _data = _data;
            if (_data.success) {
                //                            模拟登录后消息后台推送注册
                $.ajax({
                    url: service.url.loginBack,
                    data: {
                        res: 'pc'
                    },
                    dataType: 'json',

                    type: 'post',
                    cache: false
                }).done(function(_dataBack) {
                    if (_dataBack.success) {
                        service.ajaxBase = _data.result;
                        if (!$.isPlainObject(service.ajaxBase.user)) service.ajaxBase.user = $.parseJSON(service.ajaxBase.user);
                        service.isLogin = true;
                        //                                    console.info('模拟登录成功，注册成功，功能可用');
                        //                            zty后面再改
                        if ($layout.is(':visible')) $layout.hide();
                        else $layout.show();
                        service.$dom.$inputArea.focus();
                    } else {
                        //                                    console.info('模拟登录成功，后台推送注册请求成功，但注册失败，功能可不用');
                        service.insertNotice('在线客服功能暂时不可用，请稍后再试。');
                    }
                }).fail(function() {
                    //                                console.info('模拟登录成功，后台推送注册请求失败，提示用户功能不可用');
                    service.insertNotice('在线客服功能暂时不可用，请稍后再试。');
                });
            } else {
                //                            console.info('模拟登录请求成功，模拟登录失败，提示用户功能不可用');
                service.insertNotice('在线客服功能暂时不可用，请稍后再试。');
            }
        }).fail(function() {
            //                        console.info('模拟登录请求失败，提示用户功能不可用');
            service.insertNotice('在线客服功能暂时不可用，请稍后再试。');
        });
    },
    insertNotice: function(_msg) {
        service.$dom.$msgLayout.append(service.countdownDom);
        $('.countdown').last().html(_msg);
        service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + $('.countdown').last().outerHeight(true));
    },
    insertMsg: function(_msg, _time) {
        var msg = _msg;
        var time = _time || new Date().format("yyyy-MM-d h:m:s");
        // console.info(time);
        service.$dom.$msgLayout.append(service.msgUnitGet);
        var lastMsgUnit = $('.msg-unit:last');
        $('.msg', lastMsgUnit).html(msg).find('.name').html(service.user.name);
        //                            $('.name', lastMsgUnit).html(service.user.name);
        $('.time', lastMsgUnit).html('(' + time + ')');
        service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));
    },
    getMsg: function() {
        // return;
        var lastMsgUnit;
        clearInterval(service.getTimer);
        clearInterval(service.outTimer);
        clearInterval(service.countdownTimer);
        // 即将超时提醒
        service.countdownTimer = setTimeout(function() {
            service.insertNotice('你已经有' + (service.outTime - service.countdownTime / 60).toFixed(1) + '分钟未输入内容了，再有' + service.countdownTime + '秒连接将断开！');
        }, 1000 * 60 * service.outTime - service.countdownTime * 1000);
        // 超过outTime分钟用户不发消息，停止请求消息。
        service.outTimer = setTimeout(function() {
            service.stopGetMsg();
            service.insertNotice('连接已断开！');
        }, 1000 * 60 * service.outTime);
        var msgData = {};
        service.getTimer = setInterval(function() {
            $.ajax({
                    url: service.url.get,
                    data: msgData,
                    cache: false,
                    type: 'post',
                    dataType: 'json'
                })
                .done(function(_data) {
                    if (_data.success) {
                        //                        console.info('消息请求成功');
                        //                        console.info(_data.result[0].columns.content);
                        //                        遍历消息序列
                        $.each(_data.result, function() {
                            //                            console.info(this.columns.content);
                            //                            console.info(this.columns.msgtime);
                            //                            console.info(this.columns);

                            var msg = this.columns.content;
                            var time = this.columns.msgtime.slice(0, 10);
                            service.insertMsg(msg, time);

                            // service.$dom.$msgLayout.append(service.msgUnitGet);
                            // lastMsgUnit = $('.msg-unit:last');
                            // $('.msg', lastMsgUnit).html(msg).find('.name').html(service.user.name);
                            // //                            $('.name', lastMsgUnit).html(service.user.name);
                            // $('.time', lastMsgUnit).html('(' + this.columns.msgtime + ')');

                            // service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));

                            //                            把消息插入聊天窗口
                            //                            告诉服务器消息抢收成功
                            var _this = this;
                            $.ajax({
                                type: 'post',
                                cache: false,
                                dataType: 'json',
                                url: service.url.getBack,
                                data: {
                                    type: 'calltalk',
                                    msgid: _this.columns.id
                                }
                            });

                        });

                        /*service.$dom.$msgLayout.append(service.msgUnitGet);
}
lastMsgUnit = $('.msg-unit:last');
$('.msg', lastMsgUnit).html(_msg).find('.name').html(service.user.name);
$('.name', lastMsgUnit).html(service.user.name);
service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));*/
                    } else {
                        //                        console.info('消息请求成功，消息失败');
                    }
                }).fail(function() {
                    //                    console.info('消息请求失败');

                });
        }, service.getTime);

    },
    stopGetMsg: function() {
        clearInterval(service.getTimer);
    },
    sendMsg: function(_$unit) {
        /*
  发消息规范
  msg = {
        fromid: ,//发送消息方的用户id
        toid: ,//消息接收方的用户id
        content: text,//消息内容
        type: 'calltalk',//消息包类型
        msg_type: 'text',//消息类型
        callid: 客服id
 }*/
        var msg;
        var lastMsgUnit;
        var msgData = {
            fromid: service.ajaxBase.currentUser.id, //发送消息方的用户id
            toid: service.ajaxBase.user.id, //消息接收方的用户id 可以为空
            type: 'calltalk', //消息包类型
            msg_type: 'text', //消息类型
            callid: service.ajaxBase.id //客服id 固定
        };
        //        console.info(msg);

        if (_$unit) {
            //            重发消息
            lastMsgUnit = _$unit;
            msg = lastMsgUnit.find('.content').html();
        } else {
            //            初次发消息
            msg = service.$dom.$inputArea.html();
            if (msg === '') return;
            service.$dom.$msgLayout.append(service.msgUnitSend);
            lastMsgUnit = $('.msg-unit:last');

            $('.msg', lastMsgUnit).html(service.$dom.$inputArea.html());
            $('.name', lastMsgUnit).html(service.user.name);
            service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));
        }
        msgData[service.url.name] = msg;

        $.ajax({
            cache: false,
            url: service.url.send,
            type: 'post',
            dataType: 'json',
            data: msgData,
        }).done(function(_data) {
            if (_data.success) {
                //                console.info('消息发送成功');
                var jsonmsg = $.parseJSON(_data.result.jsonmsg);
                $('.time', lastMsgUnit).html('(' + jsonmsg.msgtime + ')');

                service.getMsg();
            } else {
                //                console.info('消息发送请求成功，消息失败');
            }
            //                console.log(result, '-----done');
        }).fail(function(event, xhr, ajaxOptions, thrownError) {
            //            console.info('消息发送失败');
            lastMsgUnit.find('.error').show();
            // console.log(result, '-----error');
            /* console.info(event);
             console.info(xhr);
             console.info(ajaxOptions);
             console.info(thrownError);*/
            /* Act on the event */
        });
        service.$dom.$inputArea.html('').focus();

    },
    // 发送消息，jsonp回调
    sendBack: function(_data) {
        //        console.info(_data);
        return _data;
    }
}

function sendBack(_data) {
    //    console.info(_data);
    return _data;
}


/** 
 * 时间对象的格式化; 
 */
Date.prototype.format = function(format) {
    /* 
     * eg:format="yyyy-MM-dd hh:mm:ss"; 
     */
    var o = {
        "M+": this.getMonth() + 1, // month  
        "d+": this.getDate(), // day  
        "h+": this.getHours(), // hour  
        "m+": this.getMinutes(), // minute  
        "s+": this.getSeconds(), // second  
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter  
        "S": this.getMilliseconds()
            // millisecond  
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
