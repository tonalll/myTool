function ui(_$g) {
    // document.body.onselectstart = document.body.ondrag = function() {
    //     // return false;
    // }
    var $g = _$g || document;
    // 通用删除操作
    $('.m-delete').each(function(i, e) {
        var $this = $(this);
        var option = $.zJSON($this.attr('data-options'));
        $this.on({
            click: function() {
                index.confirm(option.msg, {
                    enter: function() {
                        $.ajax({
                                url: option.url,
                                type: 'post',
                                dataType: 'json'
                            })
                            .done(function(_json) {
                                global.ajax.done(_json);
                            })
                    },
                    mask: true
                })

            }
        });
    });
    // 使用此凭证
    $('.useThis', $g).each(function(index, el) {
        var $this = $(this);

        $this.on({
            click: function() {
                $.ajax({
                        data: { date: $this.closest('.window').find('.vch_date ').val() },
                        url: $this.attr('data-url'),
                        dataType: 'json'
                    })
                    .done(function(_data) {
                        var $voucherLayout = $this.closest('.window').find('.voucherLayout');
                        stage.close();
                        var data = _data;
                        voucher.clearBody($voucherLayout);
                        voucher.setData(data, $voucherLayout);
                        // console.log("success");
                    });
            }
        });
    });

    // 屏蔽自动填充
    $('input[autocomplete=off]', $g).each(function(index, el) {
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
    // 任务栏滚动拖动滚动条
    $('#unit-scroll', $g).drag({
        lockX: true,
        top: 0,
        bottom: 0,
        draBack: function() {
            var $scroll = $('#unit-scroll');
            var $layout = $('.unit-layout');
            var $taskBar = $('#taskBar');
            // console.info(-$scroll.position().top / ($taskBar.height() - 30 - $layout.height()) * ($layout.height() - $taskBar.height() - 30));
            // console.info($scroll.position().top / ($taskBar.height() - 30 - $scroll.height()));
            $layout.css({
                top: $scroll.position().top / ($taskBar.height() - 30 - $scroll.height()) * ($taskBar.height() - $layout.height() - 30)
            });
        }
    });
    // 任务栏滚动
    $('.unit-layout', $g).on({
        mousewheel: function(event, delta) {
            // console.info(delta);
            var $scroll = $('#unit-scroll');
            var $layout = $('.unit-layout');
            var $taskBar = $('#taskBar');
            if ($scroll.is(':hidden')) return;
            if (delta == 1 && parseInt($layout.css('top')) >= 0) {
                $layout.css('top', '0');
                $scroll.css('top', '0');
                return;
            }
            if (delta == -1 && $layout.height() - Math.abs(parseInt($layout.css('top'))) <= $taskBar.height() - 30) {
                $layout.css('top', $taskBar.height() - $layout.height() - 30);
                $scroll.css('top', $taskBar.height() - $scroll.height() - 30);
                return;
            }
            $layout.css('top', parseInt($layout.css('top')) + delta * 30);
            setTimeout(function() {}, 200);
            $scroll.css('top', parseInt($layout.css('top')) / ($taskBar.height() - $layout.height() - 30) * ($taskBar.height() - $scroll.height() - 30));
        }
    });
    // $('#taskBar',$g).mousewheel(function(event, delta) {
    //     console.info(event, delta);
    // });
    // 帐套页面公司名和帐套名长度控制
    $('.head-name', $g).each(function(index, el) {
        var $this = $(this);
        var str = $this.html();
        $this.attr('title', str);
        if (str.length >= 11) $this.html(str.slice(0, 10) + '···');
    });
    // 显示主页
    $('.showDesk', $g).on({
        click: function() {
            index.desk.showDesk();
            return false;
        }
    });
    // 未操作完禁止切换窗口和返回
    $('#taskBar,#start', $g).on({
        mouseenter: function() {
            index.taskBar.ableChange();
        }
    });
    // fgjhfgjh
    //    表单和块布局        
    //      两边无边距
    $('.l-table-collapse-both .l-table-cell', $g).each(function() {
        var $this = $(this);
        var tmpClass = $this.attr('class');
        $this.wrapInner('<div class="l-table-cell-layout"></div>').removeClass().addClass('l-table-cell').find('.l-table-cell-layout').removeClass().attr('class', tmpClass).addClass('l-table-cell-layout').removeClass('l-table-cell');
    });
    $('.l-table-collapse-both', $g).each(function() {
        var $thisTable = $(this);
        $thisTable.find('>.l-table-cell:last').find('>.l-table-cell-layout').css({
            marginRight: 0
        })
    });


    //      fields布局过过滤空label
    $('.l-field label:empty', $g).html('&nbsp');
    //        表单布局
    $('.l-fields', $g).each(function(index, element) {
        var $fields = $(this);
        var $field = $fields.find('>.l-field');
        $field.css({
            width: 100 / $field.length + '%'
        })
    });
    // 必填项加红色"*"标记
    $('.l-field', $g).each(function(index, el) {
        var $input = $(this).find('input');
        var $label = $(this).find('label');
        var tmpHtml = "<span class='c-color-red'>&nbsp*</span>"
        if ($input.is('.required') && $label.html() != '&nbsp;') $label.html($label.text() + tmpHtml);
    });


    //首页菜单
    $('.submenu', $g).hide();
    $('#start', $g).on({
        mouseenter: function() {
            $(this).addClass('c-bAlpha-3');
            $('#menu').fadeIn(50);
            if ($(this).data().timer) {
                clearTimeout($(this).data().timer);
            }
        },
        mouseleave: function() {
            $(this).removeClass('c-bAlpha-3');
            $(this).data().timer = setTimeout(function() {
                $('#menu').hide();
            }, 350);
        }
    });
    $('#menu .list', $g).on({
        mouseover: function() {
            $(this).addClass('c-wAlpha-2').find('.submenu').show()
        },
        mouseleave: function() {

            $(this).removeClass('c-wAlpha-2').find('.submenu').hide()
        }
    });
    //    菜单图标设置 一级菜单为二级首个菜单的图标
    $('#menu [desk-option]', $g).each(function() {
        var $this = $(this);
        $this.find('.ico').addClass($.zJSON($this.attr('desk-option')).ico);
        //        如果是二极菜单的第一项，刚把图标同时加给父菜单 
        /*        if ($this.index() == 0 && $this.parent().hasClass('submenu')) {
                    $this.parent().siblings('.ico').addClass($.zJSON($this.attr('desk-option')).ico);
                }*/
    });

    //点击后在桌面打开
    $('[desk-option]', $g).each(function() {
        var $this = $(this);
        $this.on({
            click: function() {
                index.desk.newWindow($.parseJSON($this.attr('desk-option')));
                if ($this.parents('#menu').length) $this.parents('#menu').trigger('mouseleave');
                return false;
            }
        })
    });
    // 重置按钮自定义组件重置行为
    $(':reset', $g).each(function(index, el) {
        var $this = $(this);
        var $form = $this.closest('form');
        $select = $('.m-select', $form);
        var $dropdownSeurch = $('.dropdownSeurch', $form);
        // 单选按钮、多选按钮
        var $radioAndcheckbox = $(':radio,:checkbox', $form);
        $this.on({
            click: function() {
                if ($select.length) $select.each(function(index, el) {
                    $(this).mSelect('refresh');
                });
                if ($dropdownSeurch.length) $dropdownSeurch.each(function(_index, _element) {
                    var data = $.zJSON($(this).attr('data-options'));
                    if (data.inputHiddenName) {
                        var $input = $('input[name="' + data.inputHiddenName + '"]');
                        $input.val($input.attr('data-default'));
                    }

                });
                if ($radioAndcheckbox.length) $radioAndcheckbox.each(function(index, el) {
                    var $this = $(this);
                    setTimeout(function() {
                        var $onoff = $this.next();
                        if ($this.prop('checked')) $onoff.removeClass('m-onoff-off').addClass('m-onoff-on');
                        else $onoff.removeClass('m-onoff-on').addClass('m-onoff-off');
                    }, 300);
                });
            }
        });

    });
    //    普通表单ajax提交
    $('form.ajaxSubmit', $g).each(function() {
        var $form = $(this);
        var validator = $form.validate();
        $form.on({
            submit: function() {
                //              console.info(bb.form()+'----'+bb.numberOfInvalids());  
                if (validator.valid()) {
                    // console.info('---可以提交了---');
                    global.ajax.ajaxSubmit($form);
                }
                return false;
            }
        });
    });
    //    反馈表单ajax提交
    $('form.backAjaxSubmit', $g).each(function() {
        var $form = $(this);
        var validator = $form.validate();
        $form.on({
            submit: function() {
                //              console.info(bb.form()+'----'+bb.numberOfInvalids());  
                if (validator.valid()) {
                    // console.info('---可以提交了---');
                    global.ajax.backAjaxSubmit($form);
                }
                return false;
            }
        });
    });

    //    window分页提交
    $('form.pageSubmit', $g).each(function() {
        var $form = $(this);
        var select = $form.attr('pageLayout');
        var $pageLayout = $form.parents('.' + select + ':first').length ? $form.parents('.' + select + ':first') : $form.parents('#' + select + ':first');
        var $gridBar = $('.m-gridBar');
        if ($gridBar.length) {
            $gridBar.data().$form = $form
            $gridBar.data().$pageLayout = $pageLayout;
        }
        $pageLayout.data().$form = $form;
        if ($pageLayout.length == 0) {
            alert('form表单分页容器获取失败,分页容器可能设置错误！');
            return;
        }
        var $pageBar = $('.m-pageBar', $pageLayout);
        $pageBar.attr({
            pageLayout: select
        });
        var validator = $form.validate();
        //        console.info(bb);
        $form.on({
            submit: function() {
                //              console.info(bb.form()+'----'+bb.numberOfInvalids());  
                if (validator.valid()) {
                    // console.info('---可以提交了---');
                    global.ajax.pageSubmit($form, $pageLayout);
                }
                return false;
            }
        })
    });


    //分页
    $('.m-pageBar', $g).each(function() {
        var $pageBar = $(this);
        var select = $pageBar.attr('pageLayout');
        // console.info(select);
        var $pageLayout = $pageBar.parents('.' + select + ':first').length ? $pageBar.parents('.' + select + ':first') : $pageBar.parents('#' + select + ':first');
        if ($pageLayout.length == 0) {
            alert('分页按钮分页容器获取失败,分页容器可能设置错误！');
            return;
        }

        var pageButtonHover = 'm-pageButton-hover';

        var $form = $pageLayout.find('form');
        var $pagePrev = $pageBar.find('.m-pagePrev');
        var $pageNext = $pageBar.find('.m-pageNext');
        var $pageButton = $pageBar.find('.m-pageButton');
        var $pageGo = $pageBar.find('.m-pageGo');
        var $pageGoInput = $pageBar.find('.m-pageGoInput');
        var $pageSelect = $pageBar.find('select');

        var pageNow = Number($pageBar.attr('page-now'));
        var pageTotal = Number($pageBar.attr('page-total'));
        var pageLength = Number($pageBar.find('select').val());
        var pageTarget;


        //        填充分页
        //        每组分页长度
        var pageGroupLength = 10;
        //        一共多少组分页
        var pageGroupTotal = Math.ceil(pageTotal / pageGroupLength);
        //        当前页所在组的索引0开始
        var thisPageIndex = Math.ceil(pageNow / pageGroupLength);
        var $pageDom = $('.m-pagePrev', $pageBar).nextUntil('.m-pageNext', $pageBar);
        $pageDom.hide();
        //        填充页码
        $pageDom.each(function(i, e) {
            var $this = $(this);
            var $thisPage = (thisPageIndex - 1) * pageGroupLength + i + 1;
            // console.info($thisPage);
            if ($thisPage > pageTotal) {
                $this.hide();
                return;
            } else {
                $this.show().text($thisPage);
                if (pageNow == parseInt($this.text())) $this.addClass('m-pageButton-hover');
            }

        });



        //        初始化分页
        $pageButton.eq(pageNow - 1).addClass(pageButtonHover);


        //        上一页
        $pagePrev.on({
            click: function() {
                pageTarget = pageNow - 1 ? pageNow - 1 : false;
                //                console.info(pageTarget)
                if (pageTarget) global.ajax.pageAjax($form, $pageLayout, pageTarget, pageLength);

            }
        });





        //        下一页
        $pageNext.on({
            click: function() {
                pageTarget = pageNow != pageTotal ? pageNow + 1 : false;
                if (pageTarget) global.ajax.pageAjax($form, $pageLayout, pageTarget, pageLength);
                //                console.info(pageTarget)

            }
        });


        //        普通分页
        $pageButton.each(function() {
            var $button = $(this);
            $button.on({
                click: function() {
                    global.ajax.pageAjax($form, $pageLayout, Number($button.text() || pageNow), pageLength);
                }
            });
        });

        //        选择每页显示多少条
        $pageSelect.on({
            change: function() {
                //                console.info($pageSelect.val());
                global.ajax.pageAjax($form, $pageLayout, 1, $pageSelect.val());
            }
        });
        // 回车自动跳转
        $pageGoInput.on({
            keyup: function(e) {
                if (e.keyCode == 13) {
                    if ($(this).val()) $pageGo.click();
                }
            }
        });
        //        跳转分页
        $pageGo.on({
            click: function() {
                // console.info($pageGoInput.val());
                if (!$pageGoInput.val()) return;
                global.ajax.pageAjax($form, $pageLayout, $pageGoInput.val(), pageLength);
            }
        });



    });


    //双色表格
    $('table tbody', $g).each(function() {
        var $tbody = $(this);
        $tbody.find('tr:odd').addClass('c-trOdd');
        $tbody.find('tr').each(function() {
            var $tr = $(this);
            $('td:first', $tr).addClass('c-trSelect-td');
            $tr.each(function(index, el) {
                $(this).anySelect({
                    className: 'c-trSelect'
                });
            });
            $tbody.on({
                mouseenter: function() {
                    $(this).addClass('c-trHover');
                },
                mouseleave: function() {
                    $(this).removeClass('c-trHover');
                }
            }, 'tr');
        });
    });

    //dialog提交
    $('.dialogSubmit', $g).each(function() {
        var $form = $(this);
        $form.on({
            submit: function() {
                global.ajax.dialogSubmit($form);
                return false;
            }
        });
    });

    //    grid修改
    $('.m-gridBar .edit', $g).each(function() {
        $(this).on({
            click: function() {
                var $this = $(this);
                var $select = $this.parents('.m-gridBar').siblings('.m-grid-body').find('.c-trSelect');
                if ($select.length !== 1) {
                    index.alert('请选择一条要修改的数据！');
                    return;
                }
                var options = $.parseJSON($this.attr('data-options'));
                options.data = {
                    id: $select.attr('data-id')
                };
                dialog.open(options);
            }
        });
    });
    //    grid删除
    $('.m-gridBar .delete', $g).each(function() {
        $(this).on({
            click: function() {
                var $this = $(this);
                var $select = $this.parents('.m-gridBar').siblings('.m-grid-body').find('.c-trSelect');
                // console.info($select);
                if ($select.length == 0) {
                    index.alert('请先选择要操作的数据！');
                    return;
                }
                var dataId = '';
                $select.each(function(index) {
                    //                    console.info($select.length,index);
                    if ($select.length - 1 == index) dataId += $(this).attr('data-id');
                    else dataId += $(this).attr('data-id') + ',';
                });
                index.confirm("确定要执行此操作吗？", {
                    enter: function() {
                        $.ajax({
                            url: $this.attr('data-url'),
                            data: {
                                id: dataId
                            },
                            dataType: 'json'
                        }).done(function(json) {
                            if (json.statusCode == 200) $select.remove();
                            global.ajax.done(json);
                        });
                    }
                })

            }
        });
    });
    //    grid审核audit
    $('.m-gridBar .audit', $g).each(function() {
        $(this).on({
            click: function() {
                var $this = $(this);
                var $select = $this.parents('.m-gridBar').siblings('.m-grid-body').find('.c-trSelect');
                // console.info($select);
                if ($select.length == 0) {
                    index.alert('请先选择要操作的数据！');
                    return;
                }
                var dataId = '';
                $select.each(function(index) {
                    //                    console.info($select.length,index);
                    if ($select.length - 1 == index) dataId += $(this).attr('data-id');
                    else dataId += $(this).attr('data-id') + ',';
                });
                index.confirm("确定要执行此操作吗？", {
                    enter: function() {
                        $.ajax({
                            url: $this.attr('data-url'),
                            data: {
                                id: dataId
                            },
                            dataType: 'json'
                        }).done(function(json) {
                            global.ajax.done(json);
                        });
                    }
                })

            }
        });
    });
    // 选择发票带回
    $('.m-gridBar .get-paper', $g).each(function(i, el) {
        var $this = $(this);
        $this.on({
            click: function() {
                var data = global.functions.getGridSelect($this.parents('.m-gridBar').siblings('.m-grid-body'));
                var $parent = $this.closest('.window');
                if (!$parent.length) $parent = $this.closest('.m-dialog');
                $('#select_paper', $parent).val(data);
                $this.parents('.stage').find('.stage-back').click();
            }
        });
    });

    //    查找带回
    $('.m-lookup', $g).each(function() {
        //
    });
    $('tr[data-lookup]', $g).each(function() {
        var $this = $(this);
        $this.on({
            dblclick: function() {
                var data = $.parseJSON($this.attr('data-lookup'));
                //                console.info(data);
                $.each(data, function(i, n) {
                    //                    console.info(i+'----'+n);
                    $('[name=' + i + ']').val(n).trigger('change').trigger('focusout');
                });
                dialog.close();
            }
        });
    });
    //tab组件
    $('.m-tab', $g).each(function() {
        $(this).tab();
    });
    //ztree
    $('.ztree', $g).each(function() {
        var zTreesetting = {
            view: {
                selectedMulti: false,
                showTitle: true // 2 这个开关也要打开，默认是关闭的
            },
            data: {
                key: {
                    title: "title"
                },
                simpleData: {
                    enable: true
                }
            },
            callback: {}
        };
        var $this = $(this);
        var setting = $.zJSON($this.attr('data-options'));
        zTreesetting = $.extend({}, zTreesetting, setting.zTreeSetting);
        // console.info(zTreesetting);
        //        console.info(setting);
        $.ajax({
            url: setting.url,
            dataType: 'json'
        }).done(function(_json) {
            // $.each(_json,function(i,n){
            // console.info(i);
            // console.info(n);
            // });
            // console.info(_json);
            var json = _json;
            for (var name_i = 0; name_i < json.length; name_i++) {
                if (json[name_i].name.length >= 14) json[name_i].name = json[name_i].name.slice(0, 10) + '...';
            }
            $.fn.zTree.init($this, zTreesetting, json);
            // console.info($this.html());

        });

    });
    //多个按钮组
    $('.m-button-list', $g).each(function() {
        var $this = $(this);
        var $firstLi = $this.find('li:first');
        var maxWidth = 0;
        if (!$firstLi.length) {
            $this.remove();
            return;
        }
        $this.find('li').each(function() {
            if ($(this).outerWidth(true) > maxWidth) maxWidth = $(this).outerWidth();
        });
        $firstLi.addClass('m-button-first');

        $this.width(maxWidth + 30);
        if ($this.is("[width]")) $this.width(Number($this.attr('width').replace('px', '').replace(';', '')));

        $this.find('ul').width('100%');
        $this.find('li').width('100%');
        $firstLi.siblings().hide();
        $this.on({
            mouseenter: function() {
                $firstLi.siblings().show();
                // console.info($this.zMargin('bottom'));
                // console.info($this.position());
            },
            mouseleave: function() {
                $firstLi.siblings().hide();
            }
        });
    });
    //    ----------------------插件类----------------------//
    //    单选多先
    $('input:radio,input:checkbox', $g).each(function() {
        $(this).onoff().hide();
    });

    //    dialog
    $('[target=dialog]', $g).each(function() {
        var $this = $(this);
        $this.on({
            click: function() {
                dialog.open($.parseJSON($this.attr('data-options')));
            }
        })
    });
    // dialog-stage
    /*    $('[target=dialog-stage]', $g).each(function(i, el) {
            dialog.stage($(this));
        });*/
    // stage组件用于window、dialog之上的容器
    $('[target=stage]', $g).each(function(i, el) {
        var $this = $(this);
        $this.on({
            click: function() {
                var data = $.zJSON($this.attr('data-options'));
                if ($this.closest('.window').length) data.target = 'window';
                else data.target = 'dialog';
                stage.open(data, $this);
            }
        })
    });
    // superStage组件
    $('[target=superStage]', $g).each(function(i, el) {
        var $this = $(this);
        $this.on({
            click: function() {
                var data;
                if ($.isEmptyObject($this.data())) {
                    data = $this.data();
                    if (data.onClose == 'hide') {
                        superStage.getSuperStage()
                        superStage.getSuperStage(data.id).show();
                        dialog.mask.show();
                    } else {
                        superStage.open(data);
                    }
                } else {
                    data = $.zJSON($this.attr('data-options'));
                    data.id = data.id || 'superStage' + new Date().getTime();
                    $this.data(data);
                    var thisSuperStage = superStage.getSuperStage(data.id);
                    if (thisSuperStage && thisSuperStage.length) {
                        thisSuperStage.show();
                        thisSuperStage.css({
                            top: ($(window).height() - thisSuperStage.height()) / 2,
                            left: ($(window).width() - thisSuperStage.width()) / 2
                        });
                        thisSuperStage.find('.body').first().height(thisSuperStage.height() - thisSuperStage.find('.head').outerHeight(true));
                        dialog.mask.show();
                    } else {
                        superStage.open(data);
                    }
                }
                return false;
            }
        })
    });
    // superStage组件默认存在的情况
    $('.m-superStage .close', $g).each(function(index, el) {
        var $this = $(this);
        $this.on({
            click: function() {
                var $button = $("[target=superStage][data-options*='" + $this.closest('.m-superStage').attr('id') + "']");
                var data = $.zJSON($button.attr('data-options'));
                if (data.onClose == 'hide') $this.closest('.m-superStage').hide();
                else $this.closest('.m-superStage').remove();
                dialog.mask.hide();

            }
        });
    });
    //    右键菜单 
    $('#unitContextMenu', $g).on({
        mouseleave: function() {
            $(this).hide();
        }
    });
    //    关闭
    $('#unit-close', $g).on({
        click: function() {
            var $unitContextMenu = $('#unitContextMenu');
            // console.info($unitContextMenu.data());
            index.desk.window.close($unitContextMenu.data().id);
            $unitContextMenu.hide();
        }
    });
    //    固定
    $('#unit-fix', $g).on({
        click: function() {
            var $unitContextMenu = $('#unitContextMenu');
            $.ajax({
                url: index.config.unitFix,
                dataType: 'json',
                data: {
                    id: $unitContextMenu.data().id
                }
            }).done(function() {
                index.alert('固定菜单成功');
                // console.info($unitContextMenu.data());
                var $unit = index.taskBar.getUnit($unitContextMenu.data().id);
                $unit.addClass('unit-fixed');
                var unitObj = $.zJSON($unit.attr('desk-option'));
                //                index.taskBar.unit[unitObj.id]=unitObj;
                index.taskBar.unit[unitObj.id] = $.extend({
                    $dom: $unit
                }, unitObj);
            });
        }
    });
    //    刷新
    $("#unit-refresh", $g).on({
        click: function() {
            var $unitContextMenu = $('#unitContextMenu');
            // console.info($unitContextMenu.data())
            index.desk.window.refresh($unitContextMenu.data().id)
        }
    });

    //    解除固定
    $('#unit-unfix', $g).on({
        click: function() {
            var $unitContextMenu = $('#unitContextMenu');
            $.ajax({
                url: index.config.unitUnfix,
                dataType: 'json',
                data: {
                    id: $unitContextMenu.data().id
                }
            }).done(function() {
                index.alert('解除固定菜单成功');
                // console.info($unitContextMenu.data());
                var $unit = index.taskBar.getUnit($unitContextMenu.data().id);
                $unit.removeClass('unit-fixed');
                if (!$unit.hasClass('unit-active') && !$unit.hasClass('unit-sleep')) {
                    $unit.remove();
                    $unitContextMenu.hide();
                    index.desk.window[$unitContextMenu.data().id] = undefined;
                    index.taskBar.unit[$unitContextMenu.data().id] = undefined;
                }
            });
        }
    });
    // 任务栏图标文字不同时显示时，兼容菜单过多滚动显示，标题动态显示
    $('#taskBar', $g).on({
        mouseover: function() {
            if ($('body').hasClass('taskBarTitle')) return;
            $('#taskBar').addClass('taskBarHover');
        },
        mouseleave: function() {
            if ($('body').hasClass('taskBarTitle')) return;
            $('#taskBar').removeClass('taskBarHover');
        }
    }, '.unit');
    //datagrid表样式 
    $('.m-grid-head', $g).each(function() {
        var $headTable = $(this).find('table');
        var $bodyTable = $(this).nextAll().filter('.m-grid-body:first').find('table');
        //        猎取表头最后一行每个th的宽度放入数组
        var widthArr = [];
        var totalWidth = 0;
        var $lastTr = $('tr:last', $headTable);
        var isHidden = false;
        if ($lastTr.is(':hidden')) {
            isHidden = true;
            $lastTr.show();
        }
        if ($headTable.find('th[width]').length) {
            $('tr:last th', $headTable).each(function(index, ement) {
                var $this = $(this);
                widthArr[index] = parseInt($this.attr('width'));
                totalWidth += widthArr[index];
            });
        } else {
            $('tr:last th', $headTable).each(function(index, ement) {
                var $this = $(this);
                widthArr[index] = parseInt($this.width());
                totalWidth += widthArr[index];
            });
        }
        if (isHidden) $lastTr.find('th').css({
            border: 'none',
            background: 'none'
        });
        //        转换成百分比
        for (var tmpi = 0; tmpi < widthArr.length; tmpi++) {
            widthArr[tmpi] = 100 * widthArr[tmpi] / totalWidth + '%';
        }
        //        设置表头最后一行每个th的宽度
        $('tr:last th', $headTable).each(function(index) {
                var $this = $(this);
                $this.attr({
                    width: widthArr[index]
                });
            })
            //        设置表体第一行每个td的宽度 
        $('tr:first td', $bodyTable).each(function(index) {
            var $this = $(this);
            $this.attr({
                width: widthArr[index]
            })
        });

    });
    $('.nob-val', $g).each(function() {
        $(this).revise();
    });



    //    文件上传
    //    封闭于WebUploader插件
    //    api http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_events
    // 返回json
    /*
        {"state": "SUCCESS","title": "1446773774767006008.png","original": "FW-\u52a8\u753b-\u6548\u679c.fw.png"
    ,"type": ".png","url": "/ueditor/jsp/upload/file/20151106/1446773774767006008.png","size": "189148"}*/

    $('[upload-options]', $g).each(function() {
        var $thisUpload = $(this);
        $thisUpload.addClass('upload');
        var options = $.zJSON($(this).attr('upload-options'));
        var uploader;
        var $listLayout = $('#' + options.fileList).addClass('fileListLayout');
        // console.info(options);
        //        初始化文件上传组件
        uploader = WebUploader.create(options);
        //        初始化上传按钮

        window.tmp = uploader;
        $('#' + options.upButton).on({
            click: function() {
                uploader.upload();
            }
        }).css({
            overflow: 'hidden'
        });
        //        对初始化的文件进行删除绑定
        $listLayout.find('.fileUnit').each(function() {
            var $fileUnit = $(this);
            $fileUnit.find('.fileCancel').one('click', function() {
                $fileUnit.remove();
                if ($('#files_' + $fileUnit.attr('id')).length) $('#files_' + $fileUnit.attr('id')).remove();
                $fileUnit.remove();
            });
        });

        uploader.on('beforeFileQueued', function(file) {
            // console.info('----------',options);
            if ($listLayout.find('.fileUnit').length == options.fileNumLimit) {
                index.alert("最多只能上传" + options.fileNumLimit + "个!");
                return false;
            }
        });
        //        文件加入上传序列
        uploader.on('fileQueued', function(file) {
            // console.info(file.fileNumLimit);
            $listLayout.append('<div class="fileUnit" id="' + file.id + '"><div class="fileSuccess">&nbsp</div><div class="fileName">' + file.name + '</div><div class="fileCancel">&nbsp</div><div class="fileError"></div><div class="fileProcessBar"></div></div>');
            //            //console.info('文件数量', file);
            //            取消上传和删除已上传
            var $fileUnit = $('#' + file.id);
            $fileUnit.find('.fileCancel').one('click', function() {
                if ($('#files_' + file.id).length) $('#files_' + file.id).remove();
                $fileUnit.remove();
                uploader.removeFile(file, true);
            });
            $('#' + file.id).find('.fileProcessBar').fadeTo(10, 0.5);
        });
        //        文件上传进度显示
        uploader.on('uploadProgress', function(file, percentage) {
            $('#' + file.id).find('.fileProcessBar').css({
                width: percentage * 100 + '%'
            });
            if (percentage == 1) $('#' + file.id).find('.fileProcessBar').hide();
            //            //console.info(file);
            //            //console.info(percentage);
        });
        //        文件上传成功{}
        uploader.on('uploadSuccess', function(file, data) {
            $('#' + file.id).find('.fileSuccess').css({
                display: 'inline-block'
            });
            $thisUpload.after('<input type="hidden" name="files" value="" id="files_' + file.id + '">');
            var $fileInput = $('#files_' + file.id);
            $fileInput.val(data.original + '||' + data.type + '||' + data.url + '||' + data.size);
            $('#' + file.id).addClass('fileUnitOk');
            //            //console.info(file);
            //            //console.info(data);
        });
        //        上传错误
        uploader.on('error', function(handler) {

            if (handler == "Q_EXCEED_NUM_LIMIT") {
                index.alert("最多只能上传" + options.fileNumLimit + "个!");
            }
            if (handler == "F_DUPLICATE") {
                index.alert("文件重复!");
            }
        });

    });
    // 查看凭证
    $('.lookVoucher', $g).each(function(index, el) {
        var $lookVoucher = $(this);
        var $form = $lookVoucher.find('form');
        var $input = $form.find('.inputForMonth');
        var $select = $lookVoucher.find('.m-select');
        var $month = $lookVoucher.find('.lookVoucher-month');
        var hasVoucherArr = $lookVoucher.attr('data-hasVoucher').split(',');
        var hasCloseArr = $lookVoucher.attr('data-hasClose').split(',');
        $select.on({
            change: function() {
                // console.info('选择年份变化了');
                $form.submit();

            }
        });
        $month.each(function(index, el) {
            var $this = $(this);
            $this.on({
                click: function() {
                    $input.val(index + 1);
                    // console.info($form.serialize());
                    // console.info($input.val());
                    $form.submit();
                }
            });
        });
        // 如果当月有凭证，则区别显示
        if (hasVoucherArr.length && hasVoucherArr[0] != '') {
            for (var i = 0; i < hasVoucherArr.length; i++) {
                $month.eq(hasVoucherArr[i] - 1).addClass('hasVoucher');
            }
        }
        // 如果当月结帐，则区别显示
        if (hasCloseArr.length && hasCloseArr[0] != '') {
            for (var i = 0; i < hasCloseArr.length; i++) {
                $month.eq(hasCloseArr[i] - 1).addClass('hasClose');
            }
        }
        $('table.unit', $lookVoucher).each(function(index, el) {
            $(this).anySelect();
        });
        // 区别显示记帐区间
        // $('.hasVoucher:first',$lookVoucher).prevAll('.lookVoucher-month').addClass('noVoucher');
        // $('.hasVoucher:last',$lookVoucher).nextAll('.lookVoucher-month').addClass('noVoucher');
        // 记帐开始以前灰色显示
        if ($lookVoucher.attr('data-startAccount')) $('.lookVoucher-month', $lookVoucher).eq($lookVoucher.attr('data-startAccount') - 1).prevAll('.lookVoucher-month').addClass('noVoucher');

        // 批量删除
        $('.head .delete', $lookVoucher).each(function(index, el) {
            var $this = $(this);
            $this.on({
                click: function() {
                    var dataId = '';
                    var $select = $('table.unit.select', $lookVoucher);
                    $select.each(function(index, index) {
                        if ($select.length - 1 == index) dataId += $(this).attr('data-id');
                        else dataId += $(this).attr('data-id') + ',';
                    });
                    $.ajax({
                        url: $this.attr('data-url'),
                        data: {
                            id: dataId
                        },
                        dataType: 'json'
                    }).done(function(json) {
                        if (json.statusCode == 200) $select.remove();
                        global.ajax.done(json);
                    });
                }
            });
        });

    });
    // 查看凭证双击修改功能
    $('.lookVoucher table.unit', $g).each(function(index, el) {
        var $this = $(this);
        $this.on({
            dblclick: function() {
                $this.find('.m-button:contains("修改")').click();
            }
        });
    });
    // 删除凭证
    $('.lookVoucher-delete').each(function(i, e) {
        var $this = $(this);
        $this.on({
            click: function() {
                index.confirm('确定要删除此凭证？', {
                    enter: function() {
                        $.ajax({
                                url: $this.attr('data-url'),
                                type: 'post',
                                dataType: 'json'
                            })
                            .done(function(_json) {
                                $this.closest('table.unit').remove();
                                global.ajax.done(_json);
                            })
                    },
                    mask: true
                })

            }
        });
    });

    // 明细帐科目选择
    $('.mxz-kemu .l', $g).on({
        click: function() {
            // 自动向前先择一个科目
            var $l = $(this);
            var id = $('#detail_account_index_caption_id').val();
            if (!id) return;
            $line = $l.closest('.mxz-kemu').find('.dropdownSeurchLayout').find('[data-id=' + id + ']');
            if ($line.prev().length) $line.prev().click();
            else $line.nextAll().last().click();
        }
    });
    $('.mxz-kemu .r', $g).on({
        click: function() {
            // 自动向后先择一个科目
            var $l = $(this);
            var id = $('#detail_account_index_caption_id').val();
            if (!id) return;
            $line = $l.closest('.mxz-kemu').find('.dropdownSeurchLayout').find('[data-id=' + id + ']');
            if ($line.next().length) $line.next().click();
            else $line.prevAll().last().click();
        }
    });




    // ----------------------------------------------------------插件类----------------------------------------------------------
    //    日期控件
    if ($.fn.datepicker) {
        $('input.date', $g).addClass('m-date').each(function() {
            var $this = $(this);
            var opts = {};
            if ($this.attr("dateFmt")) opts.pattern = $this.attr("dateFmt");
            if ($this.attr("minDate")) opts.minDate = $this.attr("minDate");
            if ($this.attr("maxDate")) opts.maxDate = $this.attr("maxDate");
            if ($this.attr("mmStep")) opts.mmStep = $this.attr("mmStep");
            if ($this.attr("ssStep")) opts.ssStep = $this.attr("ssStep");
            $this.datepicker(opts);
        });
    }

    //selcet
    $('.m-select', $g).each(function(index, element) {
        var $this = $(this);
        var $label = $this.siblings('label');
        var tmpHtml = "<span class='c-color-red'>&nbsp*</span>"
        if ($this.is('.required') && $label.html() != '&nbsp;') $label.html($label.text() + tmpHtml);
        //        console.info('优化了一次select');
        $this.mSelect();
    });
    //    下拉搜索
    $('.dropdownSeurch', $g).each(function(index, element) {
        $(this).attr({
            autocomplete: 'off'
        });
        $(this).dropdownSeurch();
    });

    //    下拉树搜索
    $('.dropdownTree', $g).each(function(index, element) {
        $(this).dropdownTree();
    });
    // 凭证
    if ($.fn.voucher && $(".voucherLayout", $g).length) $(".voucherLayout", $g).each(function(index, el) {
        $(this).voucher();
    });


    // 所有表单默认第一个输入框获取焦点
    $(':text:not(".dropdownSeurch"):not(".date")', $g).first().click();

    sui($g);
}





/*
---------












*/
