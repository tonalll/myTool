/*
下拉搜索插件
此插件依赖于jqueryExtend.js
*/
(function($) {
    function _onClick(_$input, _$this, _$inputHidden) {
        _$input.val(_$this.text());
        if (_$inputHidden) _$inputHidden.val(_$this.attr('data-id'));
    }
    $.fn.dropdownSeurch = function() {
        var _options = {
            width: 200,
            height: 300,
            timeOut: 400, //请求延时
            onClick: _onClick, //点击方法
            inputAble: false, //是否允许输入
            initShow: true, //默认初始化显示所有下拉选项
            inputHiddenName: '', //隐藏域name
            autoSeurch: true, //默认前台搜索
        }
        var timer;
        var $dropdownSeurch = $(this);
        var $inputHidden;
        var options = $.zJSON($dropdownSeurch.attr('data-options'));
        options = $.extend({}, _options, options);
        $dropdownSeurch.data(options);
        if (options.inputHiddenName) {
            $inputHidden = $('input[name="' + options.inputHiddenName + '"]');
            $inputHidden.attr('data-default', $inputHidden.val());
        }
        // console.info(options);
        // console.info('下拉搜索组件');
        $dropdownSeurch.after('<div class="dropdownSeurchLayout"></div>');
        var $dropdownSeurchLayout = $dropdownSeurch.next();
        //        初始化下拉框样式
        $dropdownSeurchLayout.css({
            height: options.height,
            width: options.width
        }).hide();

        if (options.autoSeurch) {
            // 前台搜索 加载下拉
            $.ajax({
                url: options.url,
                data: { name: '' },
                global: false
            }).done(function(html) {
                $dropdownSeurchLayout.html(html);
            });
        }

        $dropdownSeurch.on({
            click: function() {
                $dropdownSeurchLayout.show();
                if (options.initShow) refreshDropdown();
            },
            focusin: function() {
                $dropdownSeurch.select();
            },
            keydown: function(e) {
                if (e.keyCode == 13) return false;
            },
            keyup: function(e) {
                var hover = 'select';
                var nowItem = $dropdownSeurchLayout.find('.select');
                var $box = $dropdownSeurchLayout;
                if (e.keyCode == 13) {
                    $dropdownSeurchLayout.find('.select').click();
                    return false;
                } else if (e.keyCode == 38) {
                    //                    向上
                    if (!nowItem.length) {
                        nowItem = $dropdownSeurchLayout.children(':visible').first();
                        // nowItem.addClass(hover);
                    } else {
                        if (nowItem.prevAll(':visible').length) nowItem = nowItem.prevAll(':visible:first');
                        else nowItem = nowItem.nextAll(':visible').last();
                        // if (nowItem.prevAll(':visible').length) nowItem.removeClass(hover).prevAll(':visible:first').addClass(hover);
                        // else nowItem.removeClass(hover).nextAll(':visible').last().addClass(hover);
                    }
                    nowItem.addClass(hover).siblings().removeClass(hover);
                    //                    调整滚动条
                    var totalHeight = $box.height();
                    var tmpHeight = 0;
                    tmpHeight = (nowItem.prevAll(':visible').length + 1.4) * nowItem.outerHeight() - $box.height() * 0.5;
                    $box.scrollTop(tmpHeight);


                } else if (e.keyCode == 40) {
                    if (!nowItem.length) {
                        nowItem = $dropdownSeurchLayout.children(':visible').first();
                    } else {
                        //                    向下
                        if (nowItem.nextAll(':visible').length) nowItem = nowItem.nextAll(':visible:first');
                        else nowItem = nowItem.prevAll(':visible').last();
                        // if (nowItem.nextAll(':visible').length) nowItem.removeClass(hover).nextAll(':visible:first').addClass(hover);
                        // else nowItem.removeClass(hover).prevAll(':visible').last().addClass(hover);
                    }
                    nowItem.addClass(hover).siblings().removeClass(hover);
                    //                    调整滚动条
                    var totalHeight = $box.height();
                    var tmpHeight = 0;
                    tmpHeight = nowItem.prevAll(':visible').length * nowItem.outerHeight() - $box.height() * 0.3;
                    $box.scrollTop(tmpHeight);
                } else {
                    $dropdownSeurchLayout.show();
                    refreshDropdown();
                    $dropdownSeurch.data().setValue = false;
                }
            }
        });

        //        input失去焦点时若鼠标位于下拉框，则下拉框不消失。
        $dropdownSeurchLayout.on({
            mouseover: function() {
                $dropdownSeurch.data().isHover = true;
            },
            mouseleave: function() {
                $dropdownSeurch.data().isHover = false;
            }
        });
        $dropdownSeurch.on({
            blur: function() {
                //                console.info($dropdownSeurch.data());
                if (!$dropdownSeurch.data().isHover) {
                    $dropdownSeurchLayout.hide();
                    if (!$dropdownSeurch.data().setValue && !options.inputAble) {
                        $dropdownSeurch.val('');
                        if (options.inputHiddenName) $inputHidden.val('');
                    }

                }

            }
        });
        // 点击下拉事件

        $dropdownSeurchLayout.on({
            click: function() {
                options.onClick($dropdownSeurch, $(this), options.inputHiddenName ? $inputHidden : '');
                $dropdownSeurchLayout.hide();
                $dropdownSeurch.data().setValue = true;

            }
        }, '[data-id]');

        //        刷新下拉框内容
        function refreshDropdown() {
            if (options.autoSeurch) {
                var $list = $dropdownSeurchLayout.children();
                // 前端搜索
                // console.info($list.filter(':contains("' + $dropdownSeurch.val() + '")'));
                var $result = $list.filter(':contains("' + $dropdownSeurch.val() + '")').hide();
                $list.not($result).hide();
                $result.show().removeClass('select').first().addClass('select');
            } else {
                // 服务器端搜索
                clearTimeout(timer);
                timer = setTimeout(function() {
                    $.ajax({
                        url: options.url,
                        data: { name: $dropdownSeurch.val() },
                        global: false
                    }).done(function(html) {
                        $dropdownSeurchLayout.html(html);
                        var $list = $dropdownSeurchLayout.children();
                        $list.each(function() {
                            var $this = $(this);
                            $this.on({
                                click: function() {
                                    options.onClick($dropdownSeurch, $this, options.inputHiddenName ? $inputHidden : '');
                                    $dropdownSeurchLayout.hide();
                                    $dropdownSeurch.data().setValue = true;

                                }
                            });
                        });
                    });
                }, options.timeOut);
            }
        }
        return this;
    }
})(jQuery)