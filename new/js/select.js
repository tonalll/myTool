/*
select插件
周同银 2014-08-08
将要美化的select增加class‘m-select’，即可，注意css样式需要引入
*/

(function($) {
    $.fn.mSelect = function(_refresh) {
        if (_refresh == 'refresh') $(this).next().remove();
        var $this = $(this); //猎取每个select对象
        var style = $this.attr('style');
        var callBack = $this.attr('data-callBack');
        $this.hide();
        $this.after('<div class="m-select-div"></div>'); //div代替原来的select
        var $div = $this.next('.m-select-div');
        $div.append('<ul class="m-select-ul"></ul>');
        var $ul = $('.m-select-ul', $div);
        //            $div.width($this.width()+10);
        for (var i = 0; i < $this.children().length; i++) {
            $ul.append('<li>' + $this.children().eq(i).html() + '</li>');
        }
        $ul.prepend('<li>' + ($this.children('[selected]').html() || $this.children(':first').html()) + '</li>');
        var $li = $('li', $ul),
            $first_li = $li.first();
        $first_li.addClass('m-the-select-li').siblings().hide();
        $div.attr({
            style: style
        }).show();
        //        点击第一个显示所有选项 
        $first_li.on({
            click: function() {
                $ul.addClass('m-select-div-hover');
                $ul.css({
                    zIndex: 2
                });
                $first_li.siblings().show();
                if ($ul.height() > 200) $ul.height(200).css({
                    overflow: 'auto'
                });;
                if ($ul.zMargin('bottom') < 0) {
                    $ul.css({
                        top: $ul.zMargin('bottom') - 20
                    });
                }


            }
        });
        //            点击事件和鼠标滑过效果
        $first_li.siblings().on({
            click: function() {
                //                    点击时候设置select值
                $this.val($this.children().eq($(this).index() - 1).val()).trigger('change').trigger('click');
                $first_li.html($(this).html()).siblings().hide();
                $ul.css({
                    top: 0,
                    zIndex: 1,
                    height: 'auto'
                });
                // console.info(1);
                if (callBack) new Function(callBack + '("'+$this.val()+'")')();
            },
            mouseover: function() {
                $(this).addClass('m-select-ul-li-hover');
            },
            mouseleave: function() {
                $(this).removeClass('m-select-ul-li-hover');
            }
        });
        //            控制隐藏与显示
        $ul.on({
            click: function() {
                //
            },
            mouseleave: function() {
                $first_li.siblings().hide();
                $ul.css({
                    top: 0,
                    zIndex: 1,
                    height: 'auto'
                });
                $ul.removeClass('m-select-div-hover');
            }
        });
        return $this;
    }
})(jQuery)
