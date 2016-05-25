/*
下拉树搜索插件
此插件依赖于ztree jqueryExtend.js
*/
(function($) {
    $.fn.dropdownTree = function() {
        var _setting = {
            width: 200,
            height: 300,
            timeOut: 400, //请求延时
            inputAble: false, //是否允许输入
            parentAble: true, //父节点是否可选
            initShow: true, //默认初始化显示所有下拉选项
            zTreeSetting: {
                view: {
                    selectedMulti: false
                },
                data: {
                    key: {
                        title: "t"
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function(event, treeId, treeNode, clickFlag) {
                        // 此回调用于点击节点后指定div加载节点相应url的内容
                        // 参数说明如下
                        //     eventjs event 对象
                        // 标准的 js event 对象
                        // treeIdString
                        // 对应 zTree 的 treeId，便于用户操控
                        // treeNodeJSON
                        // 被点击的节点 JSON 数据对象
                        // clickFlagNumber
                        // 节点被点击后的选中操作类型，详细看下表
                        // console.info(treeNode);
                        if (_setting.parentAble) {
                            $dropdownTree.val(treeNode.name);
                            $dropdownTreeLayout.hide();
                            $dropdownTree.data().setValue = true;
                        } else if (!treeNode.isParent) {
                            //                        console.info(treeNode);
                            $dropdownTree.val(treeNode.name);
                            $dropdownTreeLayout.hide();
                            $dropdownTree.data().setValue = true;
                        }
                    }
                }
            }

        }
        var timer;
        var $dropdownTree = $(this);
        var setting = $.zJSON($dropdownTree.attr('data-options'));
        // console.info(setting);
        setting = $.extend({}, _setting, setting);
        // console.info(setting);
        

        //        zTree配置
        //        console.info(setting);
        //        console.info('下拉树搜索组件');
        $dropdownTree.after('<div class="dropdownTreeLayout"><ul></ul></div>');
        var $dropdownTreeLayout = $dropdownTree.next();
        var $zTreeLayout = $dropdownTreeLayout.find('ul').addClass('ztree');
        // 将input的jquery对象追加到当前zTree的节点数据上，便于操作
        $zTreeLayout.data().$input=$dropdownTree;
        //        初始化下拉框样式
        $dropdownTreeLayout.css({
            height: setting.height,
            width: setting.width
        }).hide();
        $dropdownTree.on({
            click: function() {
                $dropdownTreeLayout.show();
                if (setting.initShow) refreshDropdown();

            },
            keyup: function() {
                refreshDropdown();
                $dropdownTree.data().setValue = false;
            }
        });

        //        input失去焦点时若鼠标位于下拉框，则下拉框不消失。
        $dropdownTreeLayout.on({
            mouseover: function() {
                $dropdownTree.data().isHover = true;
            },
            mouseleave: function() {
                $dropdownTree.data().isHover = false;
            }
        });
        $dropdownTree.on({
            blur: function() {
                //                console.info($dropdownTree.data());
                if (!$dropdownTree.data().isHover) {
                    $dropdownTreeLayout.hide();
                    if (!$dropdownTree.data().setValue && !setting.inputAble) $dropdownTree.val('');

                }

            }
        });
        //        刷新下拉框内容
        function refreshDropdown() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                $.ajax({
                    url: setting.url,
                    dataType: 'json'
                }).done(function(_json) {
                    $.fn.zTree.init($zTreeLayout, setting.zTreeSetting, _json);
                });
            }, setting.timeOut);
        }
        return this;
    }
})(jQuery)
