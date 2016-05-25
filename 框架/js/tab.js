/*
下拉搜索插件
此插件依赖于jqueryExtend.js
*/
(function($) {
    $.fn.tab = function() {
        var $tab = $(this);
        var _options = {
            height: '100%', //数字代表具体高度值 100%表示最大值
            hoverClass: "m-tab-button-hover",
            index: 0
        }
        var options = $.zJSON($tab.attr('data-options'));
        options = $.extend({}, _options, options);
        var $con = $('.m-tab-con', $tab);
        var $bar = $('.m-tab-bar', $tab);
        //        设置tab整体高度
        if (options.height == '100%') {
            $tab.height($tab.parent().innerHeight());
            $con.height($tab.height() - $bar.outerHeight(true));
            $con.children().height($con.height());
        } else if (options.height == 'auto') {
            //
        } else {
            $tab.height(options.height);
            $con.height($tab.height() - $bar.outerHeight(true));
            $con.children().height($con.height());

        }
        //        设置tab内容区域高度

        $bar.children().each(function(index, element) {
            var $layout = $con.children().eq(index);
            var $tabButton = $(this);
            $tabButton.on({
                click: function() {
                    if ($tabButton.is('[data-url]')) {
                        $layout.empty();
                        $layout.load($tabButton.attr('data-url'), function() {
                            // console.info(123);
                            $layout.data().url = $tabButton.attr('data-url');
                            ui($layout);
                            layout.init($layout);
                        });
                    }
                    $layout.show().siblings().hide();
                    $tabButton.addClass(options.hoverClass).siblings().removeClass(options.hoverClass);
                }
            });
        });
        $bar.children().eq(options.index).click();
        return this;
    }
})(jQuery)
