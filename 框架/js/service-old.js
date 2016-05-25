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
    base: {
        hotKey: 'ctrl+enter'
    },
    msgUnitSend: '<div class="l-table msg-unit msg-send"><div class="l-table-cell status"></div><div class="l-table-cell content"><div class="msg"></div></div><div class="l-table-cell style"></div><div class="l-table-cell user"><div class="name"></div><div class="userImg"></div></div></div>',
    msgUnitGet: '<div class="l-table msg-unit"><div class="l-table-cell user"><div class="name"></div><div class="userImg"></div></div><div class="l-table-cell style  msg-get"></div><div class="l-table-cell content"><div class="msg"></div></div><div class="l-table-cell status"></div></div>',
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
        service.user.name = service.user.name.slice(0, 2);
        $layout.css({
            top: ($window.height() - $layout.height()) / 2,
            left: ($window.width() - $layout.width()) / 2,
        });
        service.url = $.zJSON($layout.attr('data-option'));
        // 事件注册
        $('.service-float').show().on({
            click: function() {
                if ($layout.is(':visible')) $layout.hide();
                else $layout.show();
                service.$dom.$inputArea.focus();
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
                service.getMsg();
            }
        });
        $('.submit-select').on({
            click: function() {
                $(this).siblings('.l-table-collapse').show();
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
    getMsg: function() {
        var lastMsgUnit;
        clearInterval(service.getTimer);
        clearInterval(service.outTimer);
        service.outTimer = setTimeout(function() {
            service.stopGetMsg();
        }, 1000 * 60 * service.outTime);
        service.getTimer = setInterval(function() {
            $.ajax({
                    url: service.url.get,
                    data: {}
                })
                .done(function(_msg) {
                    // console.log("success");
                    service.$dom.$msgLayout.append(service.msgUnitGet);
                    lastMsgUnit = $('.msg-unit:last');
                    $('.msg', lastMsgUnit).html(_msg).find('.name').html(service.user.name);
                    $('.name', lastMsgUnit).html(service.user.name);
                    service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));
                });
        }, 3000);

    },
    stopGetMsg: function() {
        clearInterval(service.getTimer);
    },
    sendMsg: function() {
        var msg = '';
        msg = service.$dom.$inputArea.html();
        if (msg === '') return;
        var msgData = {};
        var lastMsgUnit;
        msgData[service.url.name] = msg;
        service.$dom.$msgLayout.append(service.msgUnitSend);
        lastMsgUnit = $('.msg-unit:last');
        $('.msg', lastMsgUnit).html(service.$dom.$inputArea.html());
        $('.name', lastMsgUnit).html(service.user.name);
        service.$dom.$msgLayout.scrollTop(service.$dom.$msgLayout.scrollTop() + lastMsgUnit.outerHeight(true));
        $.ajax({
                url: service.url.send,
                type: 'post',
                data: msgData
            })
            .done(function() {
                // console.log("success");
            });
        service.$dom.$inputArea.html('').focus();

    }
}
