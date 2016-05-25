/*
dialog组件
*/
var dialog = {
    open: function(_op) {
        var op = {
            title: '未命名', //
            url: '', //
            height: 450, //
            width: 800, //
            mHeight: 300, //
            mWidth: 480, //
            mask: false, //是否显示遮罩
            resize: true, //是否显示拖放控制按钮
            topBar: true, //是否显示最大化按钮
            data: {},
            id: ''
        };

        op = $.extend(op, _op);
        $.ajax({
            url: op.url,
            type: 'post',
            data: op.data
        }).done(function(html) {
            // 先关闭原来的dialog，再重新打开dialog，始终只有一个dialog
            // dialog.close();
            global.$body.append(index.frag.dialog);

            //                猎取相关对象
            var $dialog = $('.m-dialog:last');
            var $head = $dialog.find('.m-dialog-head');
            var $title = $dialog.find('.m-dialog-title');
            var $body = $dialog.find('.m-dialog-body');
            var $max = $dialog.find('.m-dialog-max');
            var $reset = $dialog.find('.m-dialog-reset');
            var $close = $dialog.find('.m-dialog-close');
            //            var $cancle = $dialog.find('.m-dialog-cancle');
            //            var $ok = $dialog.find('.m-dialog-ok');
            var $resize = $dialog.find('.m-dialog-resize');
            //                初始化dialog
            if (!op.resize) $resize.hide();
            if (!op.topBar) $max.hide();

            $reset.hide();
            if (op.id) $dialog.attr('id', op.id);
            $dialog.data(op);
            $dialog.css({
                width: op.width,
                height: op.height
            }).css({
                top: (global.$window.height() - $dialog.height()) / 2,
                left: (global.$window.width() - $dialog.width()) / 2
            });
            layout.init($dialog);
            $title.text(op.title);
            $body.html(html);
            var $form = $dialog.find('form');
            ui($body);
            //            遮罩
            $('#m-dialog-mask').fadeTo('', 0.5);
            //                关闭
            $close.on({
                click: function() {
                    $(this).parents('.m-dialog').remove();
                    $('#m-dialog-mask').fadeOut();
                    //                    临时解决跟进两个dialog需要关闭两次
                    var otherDialog = $('.m-dialog');
                    if (otherDialog.length && otherDialog.find('.m-dialog-head').html().indexOf('跟进') != -1) {
                        otherDialog.remove();

                    }
                    if (otherDialog.length && otherDialog.find('.m-dialog-head').html().indexOf('合同') != -1) {
                        otherDialog.remove();

                    }
                    // dialog.close();
                }
            });
            //                最大化
            $max.on({
                click: function() {
                    $dialog.animate({
                        width: global.$window.width(),
                        height: global.$window.height(),
                        top: 0,
                        left: 0
                    }, function() {
                        $max.hide();
                        $reset.show();
                        layout.init($dialog);
                    });
                }
            });
            //                重置大小
            $reset.on({
                click: function() {
                    $dialog.animate({
                        width: op.width,
                        height: op.height,
                        top: (global.$window.height() - op.height) / 2,
                        left: (global.$window.width() - op.width) / 2
                    }, function() {
                        $reset.hide();
                        $max.show();
                        layout.init($dialog);
                    });
                }
            });
            //            拖动
            var dragging = false,
                dragRsize = false,
                oX = 0,
                oY = 0,
                nX,
                nY;
            $(document).on({
                mouseup: function() {
                    dragging = false;
                    dragRsize = false;
                },
                mousemove: function(e) {
                    if (dragging) $dialog.css({
                        top: e.clientY - oY - global.$window.scrollTop(),
                        left: e.clientX - oX
                    });
                    if (dragRsize) {
                        $dialog.css({
                            width: e.clientX - oX > op.mWidth ? e.clientX - oX : op.mWidth,
                            height: e.clientY - oY > op.mHeight ? e.clientY - oY : op.mHeight
                        });
                        layout.resize($dialog);

                    }

                }
            });
            $head.on({
                mousedown: function(e) {
                    dragging = true;
                    oX = e.clientX - $dialog.position().left;
                    oY = e.clientY - $dialog.position().top;
                }
            });
            //            拖动改变大小
            $resize.on({
                mousedown: function(e) {
                    dragRsize = true;
                    oX = e.clientX - $dialog.width();
                    oY = e.clientY - $dialog.height();
                },
                mouseup: function() {}
            });
            //            console.info('open dialog');
            layout.init($dialog);
        });
    },
    close: function() {
        $('.m-dialog:visible:last').remove();
        $('#m-dialog-mask').fadeOut();

    },
    refresh: function(_id) {
        var id = _id;
        var $dialog = $('#' + id);
        var $dialogBody = $dialog.find('.m-dialog-body');
        var data = $dialog.data();
        $dialogBody.load(data.url, $dialogBody.find('form').serialize(), function() {
            ui($dialogBody);
            layout.init($dialogBody);
        });
    },
    mask: {
        show: function() {
            $('#m-dialog-mask').fadeTo('', 0.5);
        },
        hide: function() {
            $('#m-dialog-mask').hide();
        }
    }

}

// stage组件用于window、dialog之上的容器
var stage = {
    tmp: '',
    open: function(_op, _$dom) {
        var op = {
            title: '未命名', //
            url: '', //
            height: '100%', //
            width: '100%', //
            target: 'window',
            data: '',
            //打开组件之前，返回false则不打开，返回true打开，传入对象，通常是点击打开的按钮
            beforeOpen: function(_$open) {
                // console.info('打开前');
                return true;
            },
            //打开组件之后，传入对象，通常是点击打开的按钮
            afterOpen: function(_$open, _$back) {
                // console.info('打开后');
                return true;
            },
            //点击返回按钮之前，返回false则不返回，返回true返回，传入返回按钮的jquery对象
            beforeBack: function(_$open, _$back) {
                // console.info('返回前');
                return true;
            },
            //点击返回按钮之后，传入返回按钮的jquery对象
            afterBack: function(_$back) {
                // console.info('返回后');
                return true;
            },
            id: 'default' + new Date().getTime()
        };
        var $dom = _$dom;
        var $block, $stage, $stageTitle, $stageBack, $stageBody;
        op = $.extend(op, _op);
        // console.info(op);
        // console.info(_op);

        // 若打开前回调返回false，则不打开,默认返回true;
        // var resoult = op.beforeOpen($dom);
        // console.info(torf);
        if (!op.beforeOpen($dom)) return;

        $.ajax({
            url: op.url,
            type: 'post',
            data: op.data
        }).done(function(_html) {
            if (op.target == 'window') {
                $block = $('.window:visible');
                op.height = op.height;
                op.width = op.width;
                op.top = 0;
            } else {
                $block = $('.m-dialog:visible');
                op.height = $block.height() - 43;
                op.top = 33;
            }
            $block.append(index.frag['stage']);
            $stage = $('.stage:last', $block);
            $stageTitle = $('.stage-title', $stage);
            $stageBack = $('.stage-back', $stage);
            $stageBody = $('.stage-body', $stage);
            $stageHead = $('.stage-head', $stage);

            $stage.css({
                height: op.height,
                top: op.top
            });
            $stage.attr('id', op.id);
            $stage.data(op);
            $stageTitle.html(op.title);
            $stageBody.height($stage.height() - $stageHead.outerHeight(true));
            $stageBack.on({
                click: function() {
                    if (op.beforeBack($dom, $stageBack)) {
                        $stage.remove();
                        op.afterBack($dom);
                    }
                    // console.info(op.beforeBack);
                    // console.info(stage.beforeBack(op.beforeBack,$stageBack));
                    // if (!op.beforeBack) $stage.remove();
                    // // else if (stage.beforeBack(op.beforeBack, $stageBack)) {
                    // else if (op.beforeBack($stageBack)) {
                    //     $stage.remove();
                    //     if (op.afterBack) stage.afterBack(op.afterBack, $stageBack);
                    // }
                }
            });
            $stageBody.html(_html);
            ui($stageBody);
            // 执行打开后回调
            op.afterOpen($dom, $stageBack);


        })
    },
    // 获取当前活动stageid
    getCurrentId: function() {
        var $stage;
        if ($('.m-dialog .stage').last().length) $stage = $('.m-dialog .stage').last();
        else { $stage = $('.window .stage').last() }
        return $stage.attr('id');
    },
    // 刷新
    refresh: function(_id) {
        var id = _id || stage.getCurrentId();
        var $stage = $('#' + id);
        if (!$stage.length) {
            index.alert('id为“' + id + '”的stage组件不存在,无法刷新！', true);
            return;
        }
        var op = $stage.data();
        var $stageBody = $('.stage-body', $stage);
        $.ajax({
            url: op.url,
            type: 'post',
            data: op.data
        }).done(function(_html) {
            $stageBody.html(_html);
            ui($stageBody);
        })
    },
    close: function(_id) {
        var id = _id || stage.getCurrentId();
        var $stage = $('#' + id);
        $('.stage-back', $stage).click();
    }
}

var superStage = {
    getSuperStage: function(_id) {
        var id = _id || $('.m-superStage:visible').attr('id');
        if (id) return $('#' + id);
        else return false;
    },
    open: function(_op) {
        var op = {
            title: '未命名', //
            url: '', //
            height: '80%', //
            width: '80%', //
            data: ''
        };
        $.extend(op, _op);


        $.ajax({
            url: op.url,
            type: 'post',
            datatype: 'html'
        }).done(function(_html) {
            $('body').append(index.frag['superStage']);
            var $superStage = superStage.getSuperStage(op.id);
            $superStage.css({
                height: op.height,
                width: op.width
            });
            $superStage.css({
                top: ($(window).height() - $superStage.height()) / 2,
                left: ($(window).width() - $superStage.width()) / 2
            });
            $close = $('.close', $superStage);
            $title = $('.title', $superStage);
            $body = $('.body', $superStage);
            $body.html(_html);
            $body.height($superStage.height() - $superStage.find('.head').outerHeight(true))
            $title.html(op.title);
            $close.on({
                click: function() {
                    if (op.onClose == 'hide') $superStage.hide();
                    else $superStage.remove();
                    dialog.mask.hide();
                }
            });
            dialog.mask.show();
            ui($body);
        });
    }
}
