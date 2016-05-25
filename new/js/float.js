/*
浮动插件
周同银
2014-07-30
*/
(function($) {
    // alert(0);
    $(document).ready(function() {
        var $window = $(window),
            //        定义默认样式
            //        {rel:'',lFloat:'',lMargin:'',vFloat:'',vMargin:''}
            defaults = {
                rel: 'window',//page 容器
                lFloat: 'center',//垂直方向
                lMargin: 0,//垂直方向偏移
                vFloat: 'center',//水平方向
                vMargin: 0,//水平方向偏移
                bodyWidth: 1000,//页面宽度
                close: '',//关闭按钮
                shadow: true//遮罩
            },
            options,
            isie6 = false;
        if ('undefined' == typeof(document.body.style.maxHeight)) {
            isie6 = true;
        }

        function shadow() {
            // 遮罩
            if (options.shadow) {
                $('body').append('<div class="shadow"></div>');
                $('.shadow:last').css({
                    height: '100%',
                    width: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    background: '#000',
                    zIndex: 11
                }).fadeTo('400', 0.5);
            }
        }
        //对jquery扩展float方法
        $.fn.float = function(_options) {
            if ($(this).data().render == true) {
                $(this).show();
                shadow();
                return
            }
            //        若有设置，则使用设置参数
            options = $.extend({}, defaults, _options || {});
            var $this = $(this),
                _rel = options.rel,
                height = $this.height(),
                width = $this.width();
            //        窗口发生改变时候进行重布局
            // $this.height($this.height()).width($this.width());
            // $this.height($this.height()).width($this.width());

            function resizeset() {
                if (isie6) {
                    $this.css({
                        position: 'absolute',
                        zIndex: 99
                    });
                } else {
                    $this.css({
                        position: 'fixed',
                        zIndex: 99
                    });
                }
                // 设置上下方向
                switch (options.lFloat) {
                    case 'top':
                        $this.css({
                            top: isie6 ? $window.scrollTop() + options.vMargin : options.lMargin
                        });
                        break;
                    case 'center':
                        $this.css({
                            top: isie6 ? $window.scrollTop() + ($window.height() - height) / 2 : ($window.height() - height) / 2
                        });
                        break;
                    case 'bottom':
                        if (isie6) {
                            $this.css({
                                top: $window.scrollTop() + $window.height() - height - options.vMargin
                            })
                        } else {
                            $this.css({
                                bottom: options.vMargin
                            });
                        }
                        break;
                }
                // 设置左右方向
                if (options.rel == 'page') {
                    switch (options.lFloat) {
                        case 'left':
                            $this.css({
                                left: ($window.width() - options.bodyWidth) / 2 - options.lMargin - width
                            })
                            break;
                        case 'right':
                            $this.css({
                                right: ($window.width() - options.bodyWidth) / 2 - options.lMargin - width
                            })
                            break;
                        case 'center':
                            $this.css({
                                right: ($window.width() - width) / 2
                            })
                            break;
                        default:
                            break;
                    }
                } else {
                    switch (options.lFloat) {
                        case 'left':
                            $this.css({
                                left: options.lMargin
                            })
                            break;
                        case 'right':
                            $this.css({
                                right: options.lMargin
                            })
                            break;
                        case 'center':
                        // console.info('center');
                            $this.css({
                                right: ($window.width() - width) / 2
                            })
                            break;
                        default:
                            break;
                    }
                }


                //            当滚动时候，ie6下bug
                $window.scroll(
                    function() {
                        if (isie6) {
                            if ($this.is(":animated")) $this.stop(true);
                            if (options.vFloat == 'bottom') {
                                $this.animate({
                                    top: $window.scrollTop() + $window.height() - height - options.vMargin
                                }, 300);
                            } else if (options.vFloat == 'center') {
                                $this.animate({
                                    top: ($window.height() - height) / 2 + $window.scrollTop()
                                }, 300);
                            } else if (options.vFloat == 'top') {
                                $this.animate({
                                    top: options.vMargin + $window.scrollTop()
                                }, 300);
                            }

                        }

                    }
                );

            }
            //        初始运行一次
            resizeset();
            $this.show();
            $this.data().render = true;
            shadow();
            //滚动时候延迟100毫秒重置
            var floattimer = null;
            $(window).on({
                resize: function() {
                    clearTimeout(floattimer);
                    floattimer = setTimeout(function() {
                        resizeset();
                    }, 100);
                }
            });
            //        关闭按钮
            var $cloce = $(options.close, $this);
            if ($cloce.length) {
                $cloce.on({
                    click: function() {
                        $this.hide();
                        if (options.shadow) $('.shadow').remove();
                    }
                });
            }
        }
    });
})(jQuery)
