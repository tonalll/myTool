var index = {
    ajaxFail: function(data) {
        if (data.responseText) {
            //            index.alert.open('服务器返回信息异常！');
            console.info('异常信息：' + data.responseText);
        } else {
            console.info('服务器连接失败！');
        }
    },
    frag: {},
    config: {},
    init: function(_config) {
        var $ajaxMask = $('#m-ajax-mask'),
            $ajaxAnimate = $('#m-ajax-animate'),
            $initMask = $('#m-init-mask'),
            $initAnimate = $('#m-init-animate');
        $ajaxMask.css({
            width: '100%',
            height: $(document).height()
        });
        $ajaxAnimate.css({
            top: ($(window).height() - $ajaxAnimate.height()) / 2
        });
        $initMask.css({
            width: '100%',
            height: $(document).height()
        });
        $initAnimate.css({
            top: ($(window).height() - $initAnimate.height()) / 2
        });
        //        全局遮罩，ajax设置
        $.ajaxSetup({
            timeout: 40000,
            cache: false,
            type: 'post'
        });
        $(document).on({
            ajaxStart: function() {

                // console.info('ajaxStart');
                $ajaxMask.show();
            },
            ajaxSend: function(event, xhr, options) {
                // options.data = options.data || {};
                // options.data.tmp = 100;
                // console.info(options);
                // return false;
                // console.info('ajaxStart');
                // return false
                $ajaxMask.show();
            },
            ajaxStop: function() {
                $ajaxMask.hide();
                // console.info('ajaxStop');

            },
            ajaxSuccess: function() {
                // $ajaxMask.hide();
            },
            ajaxError: function(event, xhr, ajaxOptions, thrownError) {
                //                console.info(event);
                //                console.info(xhr);
                //                console.info(ajaxOptions);
                //                console.info(thrownError);
                // index.alert("<div>Http status: " + xhr.status + " " + xhr.statusText + "</div>" + "<div>ajaxOptions: " + ajaxOptions + "</div>" + "<div>thrownError: " + thrownError + "</div>" + "<div>" + xhr.responseText + "</div>");
                global.isTimeout(xhr.responseText);
                index.alert("<div>" + xhr.responseText + "</div>");

            }
        });



        var config = _config;
        index.config = config;
        //        加载配置文件
        $.ajax({
            url: config.xml,
            dataType: 'xml'
        }).done(function(data) {
            $(data).find("_PAGE_").each(function() {
                var pageId = $(this).attr("id");
                if (pageId) index.frag[pageId] = $(this).text();
            });
            index._init(config);
        });
    },
    _init: function(_config) {
        var config = _config;
        //        初始化全局对象
        global.init();
        //    初始化交互事件
        ui();
        // 屏蔽Backspace
        $(document).ready(function() {

            $(this).on({
                keydown: function(e) {
                    if (e.keyCode == 8 && !$(e.target).is(':input')) {
                        return false;
                    }
                }
            });
        });


        //    初始化布局
        layout.init();
        //    窗口变化重置布局
        global.$window.on({
            resize: function() {
                // console.info('窗口大小改变了');
                layout.resize();
            }
        });
        //初始化桌面
        index.desk.$desk = $('#desk');
        //        初始化任务栏
        index.taskBar.init(config);
        // 初始化引导
        if (!$.cookie('followMe')) index.followMe();
        // index.followMe();


        // 判断整数value是否等于0 
        jQuery.validator.addMethod("AgtB", function(value, element, param) {
            var target = $(param);
            var e_arr = value.split(/[\u4e00-\u9fa5]/);
            var s_arr = target.val().split(/[\u4e00-\u9fa5]/);
            if (s_arr[0] != e_arr[0]) {
                return false;
            }
            if (s_arr[1] > e_arr[1]) {
                return false;
            }
            return true;
        }, "起始期间不能大于终止期间，并且不能跨年查询");
        // 判断整数value是否等于0 
        jQuery.validator.addMethod("AltB", function(value, element, param) {
            var target = $(param);
            var e_arr = target.val().split(/[\u4e00-\u9fa5]/);
            var s_arr = value.split(/[\u4e00-\u9fa5]/);
            if (s_arr[0] != e_arr[0]) {
                return false;
            }
            if (s_arr[1] > e_arr[1]) {
                return false;
            }
            return true;
        }, "起始期间不能大于终止期间，并且不能跨年查询");


        //手机号码电话号码都可以验证
        jQuery.validator.addMethod("isPhone", function(value, element) {
            var length = value.length;
            var tels = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7}$/;
            var mobile = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/;
            var tel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            return this.optional(element) || (tel.test(value) || mobile.test(value) || tels.test(value));
        }, "请正确填写您正确的手机或固定电话号码");

        jQuery.validator.addMethod("Phone", function(value, element) {
            var length = value.length;
            var tel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            return this.optional(element) || (tel.test(value));
        }, "请正确填写您正确的手机");
        // 百度商桥定时弹窗改为点击关闭按钮后不再弹窗
        $(document).on({
            click: function() {
                // console.info('mousedown');
                $('#qiao-invite-wrap').hide().addClass('qiao-invite-wrap-zdy');
            }
        }, '.qiao-invite-close');
    },
    followMe: function() {
        $('.step1 .step-next').on({
            click: function() {
                $('.step1').hide().siblings('.step2').show();
                $('#start').trigger('mouseleave');
            }
        });

        $('.step2 .step-next').on({
            click: function() {
                $('.step2').hide().parents('#follow-me').hide();
                $.cookie('followMe', true, {
                    expires: 3650
                });

            }
        });
        // console.info('开始引导');
        setTimeout(function() {
            $('#follow-me').show().find('.step1').show();
            $('#start').trigger('mouseover');
        }, 200);



        // console.info('引导结束');
    },
    //    alert
    alert: function(_text, mask) {
        var showMask = mask || false;
        index.alertMask.hide();
        $('.m-alert').remove();
        $('body').append(index.frag['alert']);
        if (showMask) index.alertMask.show();
        var $alert = $('.m-alert:last'),
            $alertCon = $('.m-alert-con', $alert),
            $alertClose = $('.m-alert-close', $alert);
        $alertCon.html(_text || '--');
        $alert.css({
            top: -$alert.height(),
            left: (global.$window.width() - $alert.width()) / 2
        }).animate({
            top: 0
        }, 300);
        $alertClose.on({
            click: function() {
                $alert.remove();
                if (showMask) index.alertMask.hide();
            },
            mouseover: function() {
                $(this).addClass('m-alert-close-hover');
            },
            mouseleave: function() {
                $(this).removeClass('m-alert-close-hover');
            }
        });
        //        自动关闭
        setTimeout(function() {
            $alert.remove();
            if (showMask) index.alertMask.hide();
        }, 4000);
    },
    notice: function(_text) {
        index.alertMask.hide();
        $('.m-alert').remove();
        $('body').append(index.frag['notice']);
        var $alert = $('.m-alert:last'),
            $alertCon = $('.m-alert-con', $alert);
        $alertCon.html(_text || '--');
        $alert.css({
            top: -$alert.height(),
            left: (global.$window.width() - $alert.width()) / 2
        }).animate({
            top: 0
        }, 300);
        //        自动关闭
        setTimeout(function() {
            $alert.remove();
        }, 4000);
    },
    confirm: function(str, _option) {
        var option = {
            enter: function() {},
            cancel: function() {},
            mask: false
        };

        $.extend(option, _option);
        $('body').append(index.frag['confirm']);
        if (option.mask) index.alertMask.show();
        var $alert = $('.m-alert:last'),
            $alertCon = $('.m-alert-con', $alert),
            $alertClose = $('.m-alert-close', $alert);
        $alertCancle = $('.m-alert-cancle', $alert);

        $alertCon.html(str);
        $alertClose.on({
            click: function() {
                $('.m-alert:last').remove();
                index.alertMask.hide();
                option.enter();
            },
            mouseover: function() {
                $(this).addClass('m-alert-cancle-hover');
            },
            mouseleave: function() {
                $(this).removeClass('m-alert-cancle-hover');
            }
        });
        $alertCancle.on({
            click: function() {
                $('.m-alert:last').remove();
                index.alertMask.hide();
                option.cancel();
            },
            mouseover: function() {
                $(this).addClass('m-alert-cancle-hover');
            },
            mouseleave: function() {
                $(this).removeClass('m-alert-cancle-hover');
            }
        });
        $alert.css({
            top: -$alert.height(),
            left: (global.$window.width() - $alert.width()) / 2
        }).animate({
            top: 0
        }, 300);
        // close: function() {
        //     $('.m-alert:last').remove();
        //     index.alertMask.hide();
        // }
    },
    //        alert遮罩
    alertMask: {
        show: function() {
            $('#m-alert-mask').fadeTo(200, 0.5);
        },
        hide: function() {
            $('#m-alert-mask').hide();
        }
    },
    ajaxAnimate: {
        show: function() {
            $('#m-ajax-mask').show();
        },
        hide: function() {
            $('#m-ajax-mask').hide();
        },
        isShow: function() {
            return $('#m-ajax-mask').is(':visible');
        }
    },
    initAnimate: {
        show: function() {
            $('#m-init-mask').show();
        },
        hide: function() {
            $('#m-init-mask').hide();
        },
        isShow: function() {
            return $('#m-init-mask').is(':visible');
        }
    },
    desk: {
        newWindow: function(_option) {
            var op = _option;
            // console.info('newWindow');
            //            如果不存在则新打开
            if (index.desk.window[op.id] === undefined) {
                $.ajax({
                    type: "post",
                    url: op.url
                }).done(function(html) {
                    index.desk.$desk.append('<div class="window c-bgColor-f"></div>');
                    var $dom = $('.window:last', index.desk.$desk);
                    $dom.data(op);
                    $dom.html(html);
                    index.desk.window[op.id] = $.extend({
                        $dom: $dom
                    }, op);
                    // $dom.siblings('.window').hide();
                    ui($dom);
                    // console.info('---------');
                    layout.init($dom);
                    index.taskBar.addUnitAndShow(op);

                    // 关闭动画
                    $dom.height($('#desk').height());
                    $dom.siblings().css({
                        zIndex: 1
                    }).hide();
                    $dom.css({
                        zIndex: 2
                    });

                });
            } else {
                //                如果已存在则切换显示为当前
                // console.info('此窗口已打开过');
                // index.desk.window[op.id].$dom.show().siblings('.window').hide();
                var $activeWindow = index.desk.window[op.id].$dom;
                // 关闭动画
                $activeWindow.siblings().css({
                    zIndex: 1
                }).hide();
                $activeWindow.show().css({
                    zIndex: 2
                });

                index.taskBar.unit[op.id].$dom.addClass('unit-active').siblings('.unit-active').removeClass('unit-active').addClass('unit-sleep');
                if (op.autoRefresh) index.desk.window.refresh(op.id);
                else layout.init($activeWindow);

            }
        },
        window: {
            //            刷新窗口
            refresh: function(_id) {
                // console.info(_id);
                var id = _id || index.desk.getWindow().data().id;
                if (!index.desk.window[id]) return;
                var $window = index.desk.window[id].$dom;
                var $form = $window.find('form[pagelayout=window]');
                // if ($form.length) $form.submit();
                var $pageButton = $window.find('.m-pageBar[pagelayout=window] .m-pageButton-hover');
                if ($form.length && $pageButton.length) $pageButton.click();
                else if ($form.length && !$pageButton.length) $form.submit();
                else $.ajax({
                    url: $window.data().url,
                    // data:$window.data().$form.serialize(),
                    dataType: 'html'
                }).done(function(html) {
                    $window.html(html);
                    ui($window);
                    layout.init($window);
                });
            },
            close: function(_id) {
                if (!index.desk.getWindow()) return false;
                var id = _id || index.desk.getWindow().data().id;
                if (!index.desk.getWindow(id)) return false;
                index.desk.getWindow(id).remove();


                var $unit = index.taskBar.getUnit(id);

                if ($unit.hasClass('unit-fixed')) {
                    //                    如果是固定的移除样式
                    $unit.removeClass('unit-active unit-sleep');
                    index.desk.window[id] = undefined;

                } else {
                    //                    如果不是固定的移除dom
                    $unit.remove();
                    index.desk.window[id] = undefined;
                    index.taskBar.unit[id] = undefined;
                    global.functions.taskBarScrollInit();
                }
                //                移除后window的显示问题
                //                移除后如果没有活动的
                if ($('.unit-active').length == 0) {
                    //                如果有睡眠状态的激活第一个
                    if ($('.unit-sleep').length) {
                        var $unit = $('.unit-sleep:first');
                        $unit.removeClass('unit-sleep').addClass('unit-active');
                        var $window = index.desk.window[$unit.data().id].$dom;
                        $window.show().siblings('.window').hide();
                        layout.init($window);

                    } else {
                        //                如果没有睡眠状态的则显示默认主页
                        $('.window').show();

                    }
                }
                global.functions.taskBarScrollInit();
                return true;
            }
        },
        //        存在id则返回相应id的jqeury对象，否则返回当前活动的window
        getWindow: function(_id) {
            var id = _id || $('.window:visible').data().id;
            if (!id) return false;
            if (!index.desk.window[id]) return false;
            return index.desk.window[id].$dom;
        },
        showDesk: function() {
            $('.window').first().show().siblings().hide();

        }
    },
    taskBar: {
        //        初始化任务栏
        init: function(_data) {
            // 切换菜单状态显示
            var $body = $('body');
            var status = $.cookie('taskBar') || 'taskBarTitle';
            if (status == 'taskBarTitle') $body.addClass('taskBarTitle');
            $('.toogleMenu').on({
                click: function() {
                    if ($body.hasClass('taskBarTitle')) {
                        $body.removeClass('taskBarTitle');
                        $.cookie('taskBar', 'taskBar', {
                            expires: 3650
                        });
                    } else {
                        $body.addClass('taskBarTitle');
                        $.cookie('taskBar', 'taskBarTitle', {
                            expires: 3650
                        });
                    }
                    global.functions.taskBarScrollInit();
                }
            });
            //            console.info(_data)
            index.taskBar.$taskBar = $('#taskBar');
            var data = _data;
            if (data === undefined) return;
            $.ajax({
                url: data.taskBar,
                dataType: 'json',
                type: 'post'
            }).done(function(json) {
                //                console.info(json.length);
                for (var i = 0; i < json.length; i++) {
                    index.taskBar.addUnit(json[i], true);
                }
            });

        },
        $taskBar: {},
        unit: {},
        tmpUnit: {},
        addUnit: function(_json, _fixed) {
            var fixed = _fixed || false;

            //            新增一个任务栏按钮unit
            var json = _json;
            if (index.taskBar.unit[json.id] !== undefined) {
                // console.info('此任务栏按钮已新增过、无需再新增！');
                return;
            }
            var html = index.frag['unit'].replace('{id}', json.id).replace('{url}', json.url).replace(/{title}/g, json.title).replace('{ico}', json.ico).replace('{autoRefresh}', json.autoRefresh||false);
            index.taskBar.$taskBar.find('.unit-layout').append(html);
            var $unit = $('#taskBar .unit:last');
            $unit.data(json);
            $unit.find('.ico').addClass(json.ico);
            index.taskBar.unit[json.id] = $.extend({
                $dom: $unit
            }, json);
            if (fixed) {
                $unit.addClass('unit-fixed')
            }
            $unit.on({
                click: function() {
                    index.desk.newWindow($.parseJSON($(this).attr('desk-option')));
                },
                contextmenu: function(e) {
                    //                    console.info(e);
                    //                    index.alert();
                    var $unitContextMenu = $('#unitContextMenu');
                    $unitContextMenu.css({
                        top: e.pageY - 5,
                        left: e.pageX - 5
                    });
                    // console.info('右键');
                    //                    菜单初始化 
                    if ($unit.hasClass('unit-active') || $unit.hasClass('unit-sleep')) {
                        $('#unit-close').show();
                        $('#unit-refresh').show();
                    } else {
                        $('#unit-close').hide();
                        $('#unit-refresh').hide();
                    }
                    if ($unit.hasClass('unit-fixed')) {
                        $('#unit-unfix').show();
                        $('#unit-fix').hide();
                    } else {
                        $('#unit-unfix').hide();
                        $('#unit-fix').show();

                    }
                    $unitContextMenu.show();
                    $unitContextMenu.data(index.taskBar.unit[json.id]);
                    if ($unitContextMenu.zMargin('bottom') < 0) $unitContextMenu.css({
                        top: $unitContextMenu.offset().top + $unitContextMenu.zMargin('bottom')
                    });
                    // console.info($unitContextMenu.zMargin('bottom'));
                    return false;
                }
            });
            // 计算是否显示自定义滚动条
            global.functions.taskBarScrollInit();

        },
        addUnitAndShow: function(_json) {
            //            新增并显示为当前
            var json = _json;
            index.taskBar.addUnit(json);
            // console.info('新增了一个按钮并且显示');
            index.taskBar.unit[json.id].$dom.addClass('unit-active').siblings('.unit-active').removeClass('unit-active').addClass('unit-sleep');
        },
        //        存在id则返回相应id的jqeury对象，否则返回当前活动的unit
        getUnit: function(_id) {
            // console.info(_id);
            var id = _id || $('.unit-active').data().id;
            return index.taskBar.unit[id].$dom;
        },
        ableChange: function() {
            // 科目下拉列表显示不可切换
            if ($('.ui-subjectList-wrap').is(':visible')) {
                index.alert('请选择完会计科目', true);
                return false;
            }
            // 科目下拉列表显示不可切换
            if ($('#isItem').is(':visible')) {
                index.alert('请选择完会计科目', true);
                return false;
            }

            return true;
        }

    }


};
