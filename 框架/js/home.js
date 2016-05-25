// 测试环境
var ceshi = true;
var isloginUrl = '/auth/loginSeesion';

var layout = {
    init: function(_$g) {
        //      初始化布局
        var $g = _$g || document;
        var $window = $(window);
        //窗口变化重新布局
        var $head = $('#head', $g);
        var $taskBar = $('#taskBar', $g);
        var $desk = $('#desk', $g);

        $window.on({
            resize: function() {
                layout.resize();
            }
        });
        $taskBar.height($window.height() - $head.height());
        $desk.height($window.height() - $head.height() - 30).css({
            marginLeft: '4em'
        });

        //        唯一滚动条
        $('.m-scrollbar', $g).each(function() {
            // console.info($g);
            var $scrollbar = $(this);
            var $parent = $scrollbar.parent();
            var totalHieght = $parent.height($parent.height()).innerHeight();
            $scrollbar.hide().siblings().each(function() {
                //            当前元素的第一个和最后一个元素的margin值对而已的影响
                var $this = $(this);
                totalHieght -= $this.outerHeight(true);
                var firstChildren = $this.children().first();
                var lastChildren = $this.children().last();
                if (firstChildren.length) totalHieght -= (parseInt(firstChildren.css('marginTop')) + parseInt(lastChildren.css('marginBottom')));
                //                    if ($(this).hasClass('l-segment')) console.info($(this).outerHeight() + '------' + $(this).outerHeight(true));
            });
            $scrollbar.height(totalHieght).show();
        });

        //        最大宽度
        $('[max-width]', $g).each(function() {
            var $this = $(this);
            var maxWidth = parseInt($this.attr('max-width'));
            if ($this.width() > maxWidth)
                $this.width(maxWidth);
            else
                $this.width('auto');

        });
        //        

    },
    resizeTime: 0,
    resize: function(_$g) {
        var $g = _$g || document;
        // console.info(typeof layout.resizeTime);
        if (layout.resizeTime) clearTimeout(layout.resizeTime);
        layout.resizeTime = setTimeout(function() {
            layout.init($g);
        }, 100);

    }
}

$(document).ready(function() {
    // 屏蔽自动填充
    $('input[autocomplete=off]').each(function(index, el) {
        var $this = $(this);
        $this.data({ clear: true });
        $this.on({
            click: function() {
                $this.data().clear = false;
                // console.info('--------');
            }
        });
        if ($this.val() == '') {
            setTimeout(function() {
                $this.val('');
                if ($this.val() != '') {
                    setTimeout(function() {
                        if ($this.data().clear) $this.val('');
                    }, 2500);
                }
            }, 100);
        }
    });

    // 通知功能
    $('.zhongyaotongzhi .close').on({
        click: function() {
            $('.zhongyaotongzhi').hide();
        }
    });
    //    轮播
    $('.banner').each(function() {
        var $banner = $(this);
        var length = $('.banner-list li', $banner).length;
        //        初始化按钮
        $banner.prepend('<div class="banner-buttonLayout"></div>');
        var $buttonLayout = $('.banner-buttonLayout', $banner);
        $buttonLayout.prepend('<ul></ul>');
        var $buttonUl = $('ul', $buttonLayout);
        for (var i = 0; i < length; i++) {
            $buttonUl.append('<li class="banner-button"></li>');
        }
        var bannerrTime = 4000;
        var bannerTimeer;
        var height = $('.banner').height();
        //按钮鼠标事件
        $('.banner-button', $buttonUl).each(function(index, element) {
            $(this).on({
                //鼠标经过播放动画
                mouseover: function() {
                    $('.banner-list ul').stop(true, true).animate({
                        top: -height * index + 'px'
                    }, 500);
                    $(this).addClass('banner-button-hover').siblings().removeClass('banner-button-hover');
                    clearInterval(bannerrTime);

                },
                //鼠标移动删除定时器
                mousemove: function() {
                    clearInterval(bannerTimeer);
                },
                //鼠标移开创建定时器
                mouseout: function() {
                    bannerTimeer = setInterval(function() {
                        if ($('.banner-button-hover').next().length) {
                            $('.banner-button-hover').next().mouseover();
                        } else {
                            $('.banner-button:first').mouseover();
                        }
                    }, bannerrTime);
                }
            });
        });
        //        确保图片居中
        $('.banner-list a').each(function() {
            var $this = $(this);
            var $img = $this.find('img');
            $this.css({
                background: 'url("' + $img.attr('src') + '") center center no-repeat'
                    //            background:'url("") center center no-repeat'
            })
            $img.remove();
        });
        //        定时器
        bannerTimeer = setInterval(function() {
            if ($('.banner-button-hover').next().length) {
                $('.banner-button-hover').next().mouseover();
            } else {
                $('.banner-button:first').mouseover();
            }
        }, bannerrTime);
        //        初始显示第一个
        $('.banner-button:first', $banner).mouseover()
    });
    //布局
    layout.init();

    // 根据登录情况显示按钮
    //    var $loginBox = $('.loginBox');
    //    if ($loginBox.attr('data-login') == 'yes') {
    //        // 已登录
    //        $('.showLogin').hide();
    //        $('.showRegister').hide();
    //        $('.loginOver').show();
    //    } else {
    //        // 未登录
    //    }



    //  登录
    // 登录跳转注册
    $('.loginToRegister').on({
        click: function() {
            $('.loginLayout .loginClose').click();
            $('.showRegister').click();
        }
    });
    // 注册跳转登录
    $('.registerToLogin').on({
        click: function() {
            $('.registerLayout .registerClose').click();
            $('.showLogin').click();
        }
    });
    $('.NewsfoundTologin').on({
        click:function(){
            $('.newfoundLayout .newfoundClose').click();
            $('.showLogin').click();
        }
    });
    $('.showNewsfound').on({
        click:function(){
            $('.loginLayout .loginClose').click();
        }
    });

    $('.showLogin').on({
        click: function() {
            //            $.ajax({
            //                    url: '/auth/loginSeesion',
            //                    type: 'post',
            //                    dataType: 'text',
            //                    data: {
            //                        param1: 'value1'
            //                    },
            //                })
            //                .done(function(text) {
            //                    if (text == "true") {
            $('.loginLayout').float({
                close: '.loginClose'
            });
            $('.testcodeNew').click();
            //                    } else {
            //                        location = "/";
            //                    }
            //                });

                setTimeout(function(){
                    if($('.userpassword').val() == ''){
                        // debugger;
                        $('.user-pass-pos').show();
                    }else{
                        // debugger    
                         $('.user-pass-pos').hide();
                    }
                    // console.info($('.userpassword').val());
                    
                },1)
        

        }
    })
    $('#login').on({
        submit: function() {
            $.ajax({
                type: "post",
                url: $(this).attr('action'),
                data: $(this).serialize(),
                async: true,
                cache: false
            }).done(function(_json) {
                var json = _json;
                // console.info(json);
                if (json.flag) {
                    // location = json.url;
                    $('.loginLayout .loginClose').click();
                    $('.showRegister').hide();
                    $('.showLogin').hide();
                    $('.loginOver').show();
                    $('.loginName').html(json.name).attr('title', json.name);
                } else {
                    $('.testcode').val('');
                    $('.testcodeNew').click();
                    var $msg = $('.loginMsg');
                    $msg.html(json.message).show();
                    setTimeout(function() {
                        $msg.html('').fadeOut();
                    }, 3000)
                }
            });
            return false;
        }
    });
    $('.testcodeNew').on({
        click: function() {
            var baseUrl = $('.testcodeImg').data('baseUrl');
            var $img = $('.testcodeImg').find('img');
            if (!baseUrl) baseUrl = $img.attr('src');
            baseUrl.indexOf('?') == -1 ? $img.attr('src', baseUrl + '?v=' + Math.random()) : $img.attr('src', baseUrl.slice(0, baseUrl.indexOf('?')) + '?v=' + Math.random());

        }
    });
    $('.username').on({
        focus: function() {
            if ($(this).val() == '请输入用户名') $(this).val('');
        },
        focusout: function() {
            if ($(this).val() == '') $(this).val('请输入用户名');
        }
    });



    $('.userpassword').on({
        focus: function() {
            if ($(this).val() == '请输入密码') $(this).val('');
            $('.user-pass-pos').hide();
        },
        focusout: function() {
            if ($(this).val() == '') {
                $(this).val('');
                $('.user-pass-pos').show();
            }
        }
    });

    /*输入密码*/
    $('.userpassword').on({
        change: function() {
            if ($(this).val() == '') {
                $('.user-pass-pos').show();
            } else {
                $('.user-pass-pos').hide();
            }
        }
    });
    $('.user-pass-pos').on({
        click: function() {
            $('.user-pass-pos').hide();
            $(this).siblings('.userpassword').focus();
        },

    });
    //监听回车按钮 登录
    $('#login').each(function() {
        var $inp = $('#login input');
        $inp.on({
            keydown: function(e) {
                if (e.keyCode == 13) {
                    $("#login").submit();
                    // console.info("asds");
                }
            }
        });
    });
    if (jQuery.validator) jQuery.extend(jQuery.validator.messages, {
        required: "必填字段",
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
        minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
        rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
        range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: jQuery.validator.format("请输入一个最大为{0} 的值"),
        min: jQuery.validator.format("请输入一个最小为{0} 的值")
    });
    $(function() {
        $('#register').validate({
            rules: {
                login_name: {
                    remote: {
                        url: "/system/user/isUserNotExist",
                        type: "get",
                        dataType: 'json',
                        data: {
                            'login_name': function() {
                                return $("#dasf").val();
                            }
                        }
                    }
                }
            },
            messages: {
                login_name: {
                    remote: "用户名已存在"
                }
            },
            errorPlacement: function(error, element) {
                element.poshytip('destroy');
                //element.attr("title",$(error).text());
                //console.log()
                if(element.attr("name")=="as"){
                	element.poshytip({
                        content: error.text(),
                        className: 'tip-yellowsimple',
                        bgImageFrameSize: 10,
                        alignTo: 'target',
                        alignX: 'inner-left',
                        offsetX: 0,
                        offsetY: 5,
                        //showTimeout: 100
                        //hideTimeout:2000
                    }).poshytip('show');
                }else{
                element.poshytip({
                    content: error.text(),
                    className: 'tip-yellowsimple',
                    bgImageFrameSize: 10,
                    alignTo: 'target',
                    alignX: 'inner-right',
                    offsetX: 0,
                    offsetY: 5,
                    //showTimeout: 100
                    //hideTimeout:2000
                }).poshytip('show');
                }

            },
            success: function(element) {
                element.poshytip('destroy');
            }
        });
    
    $('#newfound').validate({
            rules: {
                login_name: {
                    remote: {
                        url: "/system/user/isUserNotExist",
                        type: "get",
                        dataType: 'json',
                        data: {
                            'login_name': function() {
                                return $("#dasf").val();
                            }
                        }
                    }
                }
            },
            errorPlacement: function(error, element) {
                element.poshytip('destroy');
                //element.attr("title",$(error).text());
                //console.log()
                element.poshytip({
                    content: error.text(),
                    className: 'tip-yellowsimple',
                    bgImageFrameSize: 10,
                    alignTo: 'target',
                    alignX: 'inner-right',
                    offsetX: 0,
                    offsetY: 5,
                    //showTimeout: 100
                    //hideTimeout:2000
                }).poshytip('show');

            },
            success: function(element) {
                element.poshytip('destroy');
            }
        });

    });
    //  注册
    $('.showRegister').on({
        click: function() {
            $('.registerLayout').float({
                close: '.registerClose'
            });
        }
    });

    //  找回密码
    $('.showNewsfound').on({
        click: function() {
            $('.newfoundLayout').float({
                close: '.newfoundClose'
            });
        }
    });

    // 必填项加红色"*"标记
    $('#register .l-field').each(function(index, el) {
        var $input = $(this).find('input');
        var $label = $(this).find('label');
        var tmpHtml = "<span class='c-color-red'>&nbsp*</span>"
        if ($input.is('.required')) $label.append(tmpHtml);
    });

    // 验证码
    $('.shouji').on({
        click: function() {
            $(this).addClass('yzmHover');
            $('.email').removeClass('yzmHover');
            $('.codeType').val('shouji');
        }
    });
    $('.email').on({
        click: function() {
            $(this).addClass('yzmHover');
            $('.shouji').removeClass('yzmHover');
            $('.codeType').val('email');
        }
    });
    $('.forgetPhone').on({
        click:function(){
            var $this=$(this);
            if (!$('#news_user').valid()) {
                $('#news_user').focusin();
                return;
            }
            if (!$('.phone_yz').valid()) {
                $('.phone_yz').focusin();
                return;
            }

            $.ajax({
                    url: $this.attr('data-url'),
                    data: {
                        type: 'newfound_phone',
                        number: $('.phone_yz').val(),
                        user_name:$('#news_user').val()
                    },
                    dataType: 'json'
                })
                .done(function(json) {
                    if (json.flag) {
                        var $msgnew = $('.newfoundMsg');
                        $msgnew.html('手机验证码获取成功').show();
                        setTimeout(function() {
                            $msgnew.html('').fadeOut();
                        }, 3000);

                        var $forgetPhone = $('.forgetPhone');
                        $forgetPhone.addClass('phoneCodeNewSleep');
                        var timer = 60;
                        var tmp = 0;
                        var sleepTimer = setInterval(function() {
                            tmp += 1;
                            $forgetPhone.html(timer - tmp + '秒后重新获取');
                            if (tmp == timer) {
                                $forgetPhone.removeClass('phoneCodeNewSleep').html('获取验证码');
                                clearInterval(sleepTimer);
                            }
                        }, 1000);
                    } else {
                        $('.forgetPhone_code').val('');
                        var $msgnew = $('.newfoundMsg');
                        $msgnew.html(json.message).show();
                        setTimeout(function() {
                            $msgnew.html('').fadeOut();
                        }, 3000)
                    }

                });
        }
    });
    // 手机验证码
    $('.phoneCodeNew').on({
        click: function() {
            var $this = $(this);
            if ($this.is('.phoneCodeNewSleep')) return;
            /* if (!$('.emailInput').valid()) {
                 $('.emailInput').focusin();
                 return;
             }*/
            if (!$('#dasf').valid()) {
                $('#dasf').focusin();
                return;
            }
            if (!$('.shoujiInput').valid()) {
                $('.shoujiInput').focusin();
                return;
            }
            // var codeType = $('.yzmHover').is('.shouji') ? 'shouji' : 'email';
            // var number=$('.yzmHover').is('.shouji') ? $('.shoujiInput').val() : $('.emailInput').val();
            $.ajax({
                    url: $this.attr('data-url'),
                    data: {
                        type: 'shouji',
                        number: $('.shoujiInput').val()
                    },
                    dataType: 'json'
                })
                .done(function(json) {
                    // console.log(json.flag==true);
                    // console.log(json.flag);
                    // window.tmp=json;
                    if (json.flag) {
                        var $msg = $('.registerMsg');
                        $msg.html('手机验证码获取成功！').show();
                        setTimeout(function() {
                            $msg.html('').fadeOut();
                        }, 3000);


                        var $phoneCodeNew = $('.phoneCodeNew');
                        $phoneCodeNew.addClass('phoneCodeNewSleep');
                        var timer = 60;
                        var tmp = 0;
                        var sleepTimer = setInterval(function() {
                            tmp += 1;
                            $phoneCodeNew.html(timer - tmp + '秒后重新获取');
                            if (tmp == timer) {
                                $phoneCodeNew.removeClass('phoneCodeNewSleep').html('获取验证码');
                                clearInterval(sleepTimer);
                            }
                        }, 1000);
                    } else {
                        $('.phoneCode').val('');
                        var $msg = $('.registerMsg');
                        $msg.html(json.message).show();
                        setTimeout(function() {
                            $msg.html('').fadeOut();
                        }, 3000)
                    }

                });

        }
    });
    $('#register').on({
        submit: function() {
            var $this = $(this);
            // console.info($validate.valid());
            // return false;
            if (!$this.valid()) return false;
            var $ajaxMask = $('#m-ajax-mask');
            var $ajaxAnimate = $('#m-ajax-animate');
            $ajaxMask.css('zIndex', '11111');
            $ajaxAnimate.css({
                marginTop: ($ajaxMask.height() - $ajaxAnimate.height()) / 2
            });
            $ajaxMask.show();
            $.ajax({
                    url: $this.attr('action'),
                    data: $this.serialize(),
                    dataType: 'json',
                    type: 'post'
                })
                .done(function(json) {
                    // window.tmp=json;
                    if (json.flag) {
                        // 注册成功
                        // location.reload();

                        $('.registerLayout .registerClose').click();
                        $('.registerOverLayout').float({
                            close: '.registerOverClose'
                        });
                    } else {
                        $('.phoneCode').val('');
                        var $msg = $('.registerMsg');
                        $msg.html(json.message).show();
                        setTimeout(function() {
                            $msg.html('').fadeOut();
                        }, 3000)
                    }
                    // console.log("success");
                }).always(function() {
                    $ajaxMask.hide();
                });
            return false;

        }
    });
    

    $('#newfound').on({
        submit: function() {
            var $this = $(this);
            // console.info($validate.valid());
            // return false;
            if (!$this.valid()) return false;
            var $ajaxMask = $('#m-ajax-mask');
            var $ajaxAnimate = $('#m-ajax-animate');
            $ajaxMask.css('zIndex', '11111');
            $ajaxAnimate.css({
                marginTop: ($ajaxMask.height() - $ajaxAnimate.height()) / 2
            });
            $ajaxMask.show();
            $.ajax({
                    url: $this.attr('action'),
                    data: $this.serialize(),
                    dataType: 'json',
                    type: 'post'
                })
                .done(function(json) {
                    // window.tmp=json;
                    if (json.flag) {
                        // 注册成功
                        // location.reload();
                        $('.newfoundLayout .newfoundClose').click();
                        $('.newfoundOverLayout').float({
                            close: '.newfoundOverClose'
                        });
                    } else {
                        console.info(22);
                        $('.phone_yz').val('');
                        var $msg_news = $('.newfoundMsg');
                        $msg_news.html(json.message).show();
                        setTimeout(function() {
                            $msg_news.html('').fadeOut();
                        }, 3000)
                    }
                    // console.log("success");
                }).always(function() {
                    $ajaxMask.hide();
                });
            return false;

        }
    });
    

    // 百度商桥定时弹窗改为点击关闭按钮后不再弹窗
    $(document).on({
        click: function() {
            // console.info('mousedown');
            $('#qiao-invite-wrap').hide().addClass('qiao-invite-wrap-zdy');
        }
    }, '.qiao-invite-close');


    // 点击购买产品
    $('.shopping').each(function(index, el) {
        var $this = $(this);
        $this.on({
            click: function() {
                // 是否已登录
                $.ajax({
                        url: isloginUrl
                    })
                    .done(function(text) {
                        // console.log("success");
                        if (text == "true") {
                            // 未登录显示登录和注册
                            $('.showRegister').show();
                            $('.showLogin').show();
                            $('.loginOver').hide();
                            $('.showLogin').click();
                        } else {
                            // 已登录
                            location = $this.attr('href');
                        }
                    });

                return false;
            }
        });
    });
    // 页面初始化
    if (ceshi == true) {
        // console.info('测试环境');
    } else {
        // console.info('生产环境');
        $('.showRegister').hide();
        $('.registerToLogin').hide();
        $('.loginToRegister').hide();
        $('.showNewsfound').hide();
        $('.shop-layout').hide();
        $('.gotoDingdan').hide().siblings('a').width('50%');


    }

    // 屏蔽自动填充
    $('input[autocomplete=off]').each(function(index, el) {
        var $this = $(this);
        if ($this.val() == '') {
            setTimeout(function() {
                $this.val('');
            }, 100);
        }
    });


    $(".registerClose").bind("click", function() {
        $(".tip-yellowsimple").remove();
    })


});
