var service = {
    url: {},
    $dom: {
        $inputArea: {},
        $msgLayout: {},
    },
    user: {
        name: '马云名字'
    },
    getTimer: '',
    outTimer: '',
    outTime: 1, //超过outTime分钟用户不发消息，停止请求消息。
    getTime: 10000, //请求消息时间间隔 单位毫秒
    autoLogin: false,
    miyao: '', //拿消息的密钥
    ajaxBase: {},
    base: {
        hotKey: 'ctrl+enter'
    },
    msgUnitSend: '<div class="l-table msg-unit msg-send"><div class="l-table-cell status"><div title="重新发送" class="error"></div></div><div class="l-table-cell content"><div class="msg"></div></div><div class="l-table-cell style"></div><div class="l-table-cell user"><div class="name"></div><div class="userImg"></div></div></div>',
    msgUnitGet: '<div class="l-table msg-unit"><div class="l-table-cell user"><div class="name"></div><div class="userImg"></div></div><div class="l-table-cell style  msg-get"></div><div class="l-table-cell content"><div class="msg"></div></div><div class="l-table-cell status"><div title="重新发送" class="error"></div></div></div>',
    init: function () {
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
        service.user.name = service.user.name.slice(0, 2);
        $layout.css({
            top: ($window.height() - $layout.height()) / 2,
            left: ($window.width() - $layout.width()) / 2,
        });
        service.url = $.zJSON($layout.attr('data-option'));
        // 事件注册
        $('.service-float').show().on({
            click: function () {
                //                判断是否模拟登录已
                if (service.autoLogin) {
                    if ($layout.is(':visible')) $layout.hide();
                    else $layout.show();
                    service.$dom.$inputArea.focus();
                } else {
                    //                    尝试模拟登录
                    $.ajax({
                        url: service.url.autoUrl1,
                        type: 'post',
                        dataType: 'json',
                        cache: false
                    }).done(function (_data) {
                        //                        已登录
                        if (_data.success) {
                            console.info('请求地址1成功，功能可用');
                            service.autoLogin = true;
                            //                            zty后面再改
                            service.miyao = _data.miyao;
                            if ($layout.is(':visible')) $layout.hide();
                            else $layout.show();
                            service.$dom.$inputArea.focus();
                        } else {
                            //                            未登录，请求模拟登录
                            console.info('请求地址1成功，开始请求地址2');
                            $.ajax({
                                url: service.url.autoUrl2,
                                type: 'post',
                                dataType: 'json',
                                cache: false
                            }).done(function (_data) {
                                //                                缓存result数据
                                service.ajaxBase = _data.result;
                                if (!$.isPlainObject(service.ajaxBase.user)) service.ajaxBase.user = $.parseJSON(service.ajaxBase.user);
                                //                                猎取当前用户信息
                                //                                service.ajaxBase.userInfo = _data.result.currentUser;
                                //                                猎取对应客服信息
                                //                                service.ajaxBase.kefuInfo = _data.result.user;

                                if (_data.success) {
                                    service.autoLogin = true;
                                    service.miyao = _data.miyao;
                                    console.info('请求地址2成功，功能可用');
                                    //                            zty后面再改
                                    if ($layout.is(':visible')) $layout.hide();
                                    else $layout.show();
                                    service.$dom.$inputArea.focus();
                                } else {
                                    console.info('请求地址2成功，提示用户功能不可用');
                                }
                            }).fail(function () {
                                console.info('请求地址2失败，提示用户功能不可用');
                            });
                        }
                    }).fail(function () {
                        console.info('请求地址1失败，提示用户功能不可用');
                    });
                }

            }
        });
        $('.service-float').drag({
            callBack: function (_$float) {
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
            click: function () {
                $layout.hide();
            }
        });
        $submit.on({
            click: function () {
                service.sendMsg();
                //                service.getMsg();
            }
        });
        $('.submit-select').on({
            click: function () {
                $(this).siblings('.l-table-collapse').show();
            }
        });
        // 设置快捷键
        $('.submit-layout .l-table-row').each(function (i, el) {
            var $this = $(this);
            $this.on({
                click: function () {
                    $this.addClass('select').siblings().removeClass('select');
                    if (i == 0) service.base.hotKey = 'enter';
                    else service.base.hotKey = 'ctrl+enter';
                    service.$dom.$inputArea.focus();
                }
            });
        });
        $('.submit-layout .l-table-collapse').on({
            mouseleave: function () {
                $(this).hide();
            }
        });
        // 注册快捷键
        service.$dom.$inputArea.on({
            keydown: function (e) {
                if (e.keyCode == 13 && e.ctrlKey && service.base.hotKey == 'ctrl+enter') {
                    $('.msg-submit').click();
                    console.info('ctrl+enter提交了');
                } else if (e.keyCode == 13 && !e.ctrlKey && service.base.hotKey == 'enter') {
                    $('.msg-submit').click();
                    console.info('enter提交了');
                } else if (e.keyCode == 13 && e.ctrlKey && service.base.hotKey == 'enter') {
                    service.$dom.$inputArea.insertAtCaret('<br>');
                }
            }
        });
    },
    getMsg: function () {
        // return;
        var lastMsgUnit;
        clearInterval(service.getTimer);
        clearInterval(service.outTimer);
        // 超过outTime分钟用户不发消息，停止请求消息。
        service.outTimer = setTimeout(function () {
            service.stopGetMsg();
        }, 1000 * 60 * service.outTime);
        var msgData = {
            msgid: 9999999,
            itemid: 8,
            type: 'calltalk',
            userid: service.miyao //发送消息方的用户id
        };
        service.getTimer = setInterval(function () {
            $.ajax({
                    url: service.url.get,
                    data: msgData,
                    cache: false,
                    type: 'post',
                    dataType: 'json'
                })
                .done(function (_data) {
                    if (_data.success) {
                        console.info('消息请求成功');
                        $.each(_data.result, function () {
                            console.info(this);
                        });
                        /*service.$dom.$msgLayout.append(service.msgUnitGet);
lastMsgUnit = $('.msg-unit:last');
$('.msg', lastMsgUnit).html(_msg).find('.name').html(service.user.name);
$('.name', lastMsgUnit).html(service.user.name);
service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));*/
                    } else {
                        console.info('消息请求成功，消息失败');
                    }
                }).fail(function () {
                    console.info('消息请求失败');

                });
        }, service.getTime);

    },
    stopGetMsg: function () {
        clearInterval(service.getTimer);
    },
    sendMsg: function () {
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
        var msg = '';
        msg = service.$dom.$inputArea.html();
        if (msg === '') return;
        var msgData = {
            fromid: service.ajaxBase.currentUser.id, //发送消息方的用户id
            toid: service.ajaxBase.user.id, //消息接收方的用户id 可以为空
            type: 'calltalk', //消息包类型
            msg_type: 'text', //消息类型
            callid: service.ajaxBase.id //客服id 固定
        };
        var lastMsgUnit;
        msgData[service.url.name] = msg;
        service.$dom.$msgLayout.append(service.msgUnitSend);
        lastMsgUnit = $('.msg-unit:last');
        $('.msg', lastMsgUnit).html(service.$dom.$inputArea.html());
        $('.name', lastMsgUnit).html(service.user.name);
        service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));
        $.ajax({
            cache: false,
            url: service.url.send,
            type: 'post',
            dataType: 'json',
            data: msgData,
        }).done(function (_data) {
            if (_data.success) {
                console.info('消息发送成功');
                service.getMsg();
            } else {
                console.info('消息发送请求成功，消息失败');
            }
            //                console.log(result, '-----done');
        }).fail(function (event, xhr, ajaxOptions, thrownError) {
            console.info('消息发送失败');
            // console.log(result, '-----error');
            console.info(event);
            console.info(xhr);
            console.info(ajaxOptions);
            console.info(thrownError);
            /* Act on the event */
        });
        service.$dom.$inputArea.html('').focus();

    },
    // 发送消息，jsonp回调
    sendBack: function (_data) {
        console.info(_data);
        return _data;
    }
}

function sendBack(_data) {
    console.info(_data);
    return _data;
}