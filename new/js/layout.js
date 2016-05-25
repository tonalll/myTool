var layout = {
    init: function(_$g) {
        //      初始化布局
        var $g = _$g || document;
        //窗口变化重新布局
        var $head = $('#head', $g);
        var $taskBar = $('#taskBar', $g);
        var $desk = $('#desk', $g);

        $taskBar.height(global.$window.height() - $head.height());
        $desk.height(global.$window.height() - $head.height() - 30);


        //  window宽度
        function setWindow() {
            // setTimeout(function() {
            var deskWidth = $('#desk').width();
            if (deskWidth * 0.9 > 1000) {
                // debugger;
                $('.window').css({
                    width: '90%',
                    marginLeft: '5%'
                });;
                // debugger;
            } else {
                // debugger;

                $('.window').css({
                    width: $('#desk').width(),
                    marginLeft: 0
                });
            }
            $('[max-width]', '.window').each(function() {
                var $this = $(this);
                $this.width('auto');
                var maxWidth = parseInt($this.attr('max-width'));
                if ($this.width() > maxWidth)
                    $this.width(maxWidth);
                else
                    $this.width('auto');

            });
            // }, 20);
            /*  console.info($('.window:visible').width());
              if ($('.window:visible').width() < 1000) {
                  $('.window:visible').width('100%').css({
                      marginLeft: 0
                  });
              } else {
                  $('.window:visible').width('90%');
                  $('.window').css({
                      marginLeft: ($('#desk').width() - $('.window').width()) / 2
                  });
              }*/
        }
        setWindow();
        //小屏幕任务栏伸缩
        if ($(window).width() < 1100) {
            var $taskBar = $('#taskBar');
            $taskBar.data().left = -($taskBar.width() - 10);
            var $desk = $('#desk');
            var timer = 500;
            $desk.animate({
                marginLeft: '10px',
            }, timer, setWindow);
            $taskBar.animate({
                left: -($taskBar.width() - 10)
            }, timer).on({
                mouseover: function() {
                    $taskBar.animate({
                        left: 0
                    }, timer);
                },
                mouseleave: function() {
                    $taskBar.stop(true, true).animate({
                        left: $taskBar.data().left
                    }, timer);
                }
            });
        } else {
            var $taskBar = $('#taskBar');
            var $desk = $('#desk');
            var timer = 500;
            $taskBar.data().left = 0;
            $desk.animate({
                marginLeft: '4em',
            }, timer, setWindow);
            $taskBar.animate({
                left: $taskBar.data().left
            }, timer)
        }

                //        唯一滚动条
        //        
        $('.m-scrollbar', $g).each(function() {
            // console.info($g);
            /*
            实现思路
            通过隐藏再显示当前来判断当前节点是否已设置过高度
            设置祖、父节点高度
            设置当前元素高度
            */
            var $scrollbar = $(this);
            // console.info($scrollbar);
            $scrollbar.setParentsHeight();
            setTimeout(function() {
                $scrollbar.height($scrollbar.parent().height() - $scrollbar.siblingsHeight() - parseInt($scrollbar.css('marginTop')) - parseInt($scrollbar.css('marginBottom')) - parseInt($scrollbar.css('paddingTop')) - parseInt($scrollbar.css('paddingBottom')));
            }, 100);
        });
        //表格grid右边距调整表格样式
        $('.m-grid-body', $g).each(function() {
            var $gridBody = $(this);
            //        如果有滚动条而头部差动滚动条宽度，滚动条的出现时间，延迟50毫秒执行
            setTimeout(function() {
                //                console.info(global.toolbox.has.scrollVertical($gridBody));
                if (global.toolbox.has.scrollVertical($gridBody)) {
                    $gridBody.siblings('.m-grid-head').css({
                        marginRight: $gridBody.width() - $gridBody[0].scrollWidth
                    })
                } else {
                    $gridBody.siblings('.m-grid-head').css({
                        marginRight: 0
                    })
                }
            }, 400);
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
        // 任务栏是否显示滚动条
        global.functions.taskBarScrollInit();
    },
    resizeTime: 500,
    reiszeTimer: {},
    resize: function(_$g) {
        var $g = _$g || document;
        //                console.info(typeof layout.resizeTime);
        if (layout.reiszeTimer) clearTimeout(layout.reiszeTimer);
        layout.reiszeTimer = setTimeout(function() {
            // console.info('重新渲染布局');
            layout.init($g);
        }, layout.resizeTime);

    }
}
