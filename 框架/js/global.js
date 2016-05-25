var global = {
    $window: '',
    $document: '',
    $body: '',
    $root: location.protocol + '//' + location.host,
    isTimeout: function(_str) {
        if (_str.indexOf('超时标记勿删') !== -1) {
            location.href = "/auth/home";
            return;
        }
    },
    init: function() {
        this.$window = $(window);
        this.$document = $(document);
        this.$body = $('body');


        // $('body').append(index.frag['ajax-mask']);
        // $('body').append(index.frag['init-mask']);
        $('body').append(index.frag['dialog-mask']);
        $('body').append(index.frag['alert-mask']);

        var $dialogMask = $('#m-dialog-mask'),
            $alertMask = $('#m-alert-mask');

        $dialogMask.css({
            width: '100%',
            height: $(document).height()
        });
        $alertMask.css({
            width: '100%',
            height: $(document).height()
        });

        //        验证插件提示信息初始化
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
        //        单选、多选、下拉错误显示位置
        if ($.validator) $.extend($.validator.defaults, {
            errorClass: 'validError',
            errorPlacement: function(error, element) {
                error.css({
                    background: '#f00',
                    color: "#FFF"
                });
                //                console.info(error.html()+'---'+element.html());
                if (element.is('select')) {
                    // console.info('---下拉组件');
                    // element.siblings('.m-select-div').after(error);
                } else if (element.is(':radio')) {
                    //                    if (!element.parents('form').validate.element(element)) return;

                    element.parents('.l-field:first').addClass('error');
                    element.next().next().next().after(error).siblings('.validError');

                    // console.info('---单选按钮');

                } else if (element.is(':text') || element.is(':password')) {
                    // console.info('---text输入框' + error);
                    element.after(error);
                    element.addClass('error');
                }
            },
            submitHandler: function(_form) {
                //                console.info('表单填写正确');
            }
        });

    },
    ajax: {
        //        提交成功方法
        done: function(_json) {
            var _json = _json;
            // 不需要处理逻辑错处
            // 生成凭证后自动测算金额
            if (_json.auto == 'cal') {
                $('#ce_btn').click();
            }
            // 需要逻辑错误处理
            // 2014-04-12于范思聪沟通确定去掉statusCode字段验证 错误统一进ajax错误处理
            // if (_json.statusCode == 200) {
            // console.info('刷新了tab');

            // 刷新stage
            if (_json.refreshStage) {
                stage.refresh(_json.refreshStage);
            }
            // 关闭stage
            if (_json.closeStage) {
                stage.close(_json.closeStage);
            }
            //                刷新window页面
            if (_json.refreshWindow) {
                index.desk.window.refresh(_json.refreshWindow);
                // console.info('刷新了window!')
            }
            //                    关闭window页面
            if (_json.closeWindow) {
                index.desk.window.close(_json.closeWindow);
            }
            //                刷新dialog页面
            if (_json.refreshDialog) {
                dialog.refresh(_json.refreshDialog);
                // console.info('刷新了dialog!')
            }
            if (_json.closeDialog) {
                $('.m-dialog').last().find('.m-dialog-close').click();
            }

            //                    刷新tab页面
            if (_json.refreshLayout) {
                // console.info('刷新了tab');
                var $layout = $('#' + _json.refreshLayout);
                var layoutData = $layout.data().$form ? $layout.data().$form.serialize() : '';
                $layout.load($layout.data().url, layoutData, function() {
                    ui($layout);
                    layout.init($layout);
                });
            }
            // 刷新分页容器
            if (_json.refreshPage) {
                var $pageLayout = $('#' + _json.refreshPage);
                $pageLayout.find('form').submit();
            }
            // 添加科目dialog回调 刷新科目下拉列表 并自动填写科目
            if (_json.dataValue) {
                var $td = $('table.voucher .edit_subject:visible').parents('.kemu');
                voucher.reInit($td, _json.dataValue);
            }


            index.alert(_json.message);
            // } else {
            // index.alert(_json.message);
            // }
        },
        // 表单提交前回调
        beforeBack: function(_form) {
            var $form = _form;
            var before = $form.attr('beforeBack');
            if (before) {
                if (before.indexOf('(') !== -1) return new Function('return ' + before)();
                else return new Function('return ' + before + '()')();
            } else {
                return true;
            }
        },
        // 表单提交成功后回调
        afterBack: function(_form) {
            var $form = _form;
            var after = $form.attr('afterBack');
            if (after) {
                if (after.indexOf('(') !== -1) new Function(after)();
                else new Function(after + '()')();
            } else {
                return true;
            }
        },
        //        普通表单ajax提交
        ajaxSubmit: function(_form) {
            var $form = _form;
            if (!global.ajax.beforeBack($form)) return;
            $.ajax({
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: 'json'
            }).done(function(json) {
                global.ajax.afterBack($form);
                global.ajax.done(json);
            });

        },
        backAjaxSubmit: function(_form) {
            var $form = _form;
            if (!global.ajax.beforeBack($form)) return;
            var formData = $form.serialize() + '&' + _form.attr("ueditor_name") + '=' + encodeURIComponent(UE.getEditor('editor').getContent());
            $.ajax({
                url: $form.attr('action'),
                data: formData,
                dataType: 'json'
            }).done(function(json) {
                global.ajax.afterBack($form);
                global.ajax.done(json);
            });

        },
        //        分页操作数据方法
        pageAjax: function(_$form, _$pageLayout, _pageTarget, _pageLength) {
            var $form = _$form;
            var pageTarget = _pageTarget;
            var pageLength = _pageLength;
            var $pageLayout = _$pageLayout;
            if (!global.ajax.beforeBack($form)) return;

            $.ajax({
                url: $form[0].action,
                data: $form.serialize() + '&pageTarget=' + pageTarget + '&pageLength=' + pageLength
            }).done(function(html) {
                // console.info($pageLayout);
                global.ajax.afterBack($form);
                $pageLayout.html(html);
                ui($pageLayout);
                layout.init($pageLayout);
            });
        },
        //        分页表单提交方法
        pageSubmit: function(_$form, _$pageLayout) {
            var $form = _$form;
            if (!global.ajax.beforeBack($form)) return;
            var $pageLayout = _$pageLayout;
            //            console.info('提交了');
            $.ajax({
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: 'html'
            }).done(function(html) {
                global.ajax.afterBack($form);
                $pageLayout.html(html);
                ui($pageLayout);
                layout.init($pageLayout);
            });
            //            console.info('分页form提交');

        },
        //        dialog普通表单提交
        dialogSubmit: function(_$form) {
            var $form = _$form;
            if (!global.ajax.beforeBack($form)) return;
            $.ajax({
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: 'json'
            }).done(function(json) {
                global.ajax.afterBack($form);
                global.ajax.done(json);
            });

        },
        //        页面普通表单提交
        formSubmit: function() {

        }
    },
    toolbox: {
        //        是否是
        is: {

        },
        //        是否拥有
        has: {
            //        垂直滚动条
            scrollVertical: function(_$obj) {
                var $obj = _$obj;
                var tmpTop = $obj.scrollTop();
                if ($obj.scrollTop(tmpTop + 1).scrollTop()) {
                    $obj.scrollTop(tmpTop);
                    return true;
                } else {
                    return false;
                } /**/
            },
            //            水平滚动条
            scrollHorizontal: function(_$obj) {
                var $obj = _$obj;
                var tmpLeft = $obj.scrollLeft();
                if ($obj.scrollLeft(tmpLeft + 1).scrollLeft()) {
                    $obj.scrollLeft(tmpLeft);
                    return true;
                } else {
                    return false;
                }
            }

        }

    },
    functions: {
        getGridSelect: function(_$grid) {
            var dataId = '';
            var $select = _$grid.find('.c-trSelect');
            if (!$select.length) return dataId;
            $select.each(function(index, element) {
                //                    console.info($select.length,index);
                if ($select.length - 1 == index) dataId += $(element).attr('data-id');
                else dataId += $(this).attr('data-id') + ',';
            });
            return dataId;
        },
        taskBarScrollInit: function() {
            var $scroll = $('#unit-scroll');
            var $layout = $('.unit-layout');
            var $taskBar = $('#taskBar');
            $scroll.height(($taskBar.height() - 30) / $layout.height() * ($taskBar.height() - 30));
            if ($layout.height() + 30 >= $taskBar.height()) {
                $scroll.show();
                $('.unit-layout').css('left', '10px');
                $('#taskBar').width(70);
            } else {
                $layout.css('top', '0');
                $scroll.hide();
                $('.unit-layout').css('left', '0');
                $('#taskBar').width(60);
            }
        }
    }








}
