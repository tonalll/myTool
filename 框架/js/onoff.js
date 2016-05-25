/*
选择插件
单选多选
*/
(function($) {
    $.fn.onoff = function() {
        var $this = $(this);
        $this.after("<span class='m-onoff'><span class='m-onoff-block'></span></span><span class='m-onoff-text'></span>");
        var $onoff = $this.next();
        var $text = $onoff.next();
        $text.html($this.attr('data-text'));
        $text.after('<div class="l-float-clear"></div>')
            //        console.info(index.frag.onoff);
            //        初始化样式
        if ($this.is(':checked')) {
            $onoff.addClass('m-onoff-on')
        } else {
            $onoff.addClass('m-onoff-off')

        }
        $text.on({
            click: function() {
                $onoff.click();
            }
        });
        $onoff.on({
            click: function() {
                if ($onoff.hasClass('m-onoff-on')) {
                    //                    取消选择
                    //                    console.info(1);
                    if ($this.is(':checkbox')) {
                        $onoff.removeClass('m-onoff-on').addClass('m-onoff-off').prev().prop('checked', false).trigger('change');
                    }
                } else {
                    //                    选择
                    if ($this.is(':checkbox')) {
                        //自定义iClick事件
                        $onoff.removeClass('m-onoff-off').addClass('m-onoff-on').prev().prop('checked', true).trigger('change').trigger('select').trigger('iClick');
                    } else {
                        //                        单选选择
                        $("input[name='" + $this.attr('name') + "']").next().removeClass('m-onoff-on').addClass('m-onoff-off');
                        $onoff.removeClass('m-onoff-off').addClass('m-onoff-on').prev().prop('checked', true).trigger('change').trigger('select').trigger('click');
                        //                        去掉验证错误显示
                        var $errorField = $('input[name="' + $this.attr('name') + '"]').parents('.error:first');
                        if ($errorField.length) $errorField.removeClass('error');
                    }

                }
            }
        });
        return $this;
    }
})(jQuery)
