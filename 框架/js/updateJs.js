var updateJs = {
    updateKemu: function(url, message) {
        index.confirm(message, {
            enter: function() {
                $.ajax({
                        url: url,
                        type: 'post',
                        dataType: 'json'
                    })
                    .done(function(_json) {
                        global.ajax.done(_json);
                        // 刷新科目数据对象
                        voucher.refreshKemuData();
                    })
            },mask:true
        })


    },
    update: function(url, message) {
        index.confirm(message, {
            enter: function() {
                $.ajax({
                        url: url,
                        type: 'post',
                        dataType: 'json'
                    })
                    .done(function(_json) {
                        global.ajax.done(_json);
                    })
            },mask:true
        })


    },
    pl_update: function(url, message, checked_class) {
        var ids = "";
        var customer_s = $("." + checked_class + ":checked");
        customer_s.each(function() {
            ids += $(this).val() + ",";
        })
        url = url + "?ids=" + ids
        if ("" == ids) {
            index.alert("请选择需要操作的数据");
        } else {
            $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json'
                })
                .done(function(_json) {
                    if (_json.statusCode == 200) {
                        //                刷新window页面
                        if (_json.refreshWindow) {
                            index.desk.window.refresh(_json.refreshWindow);
                            console.info('刷新了window!')
                        }
                        //                    关闭window页面
                        if (_json.closeWindow) {
                            index.desk.window.close(_json.closeWindow);
                        }
                        if (_json.closeDialog) {
                            $('.m-dialog-close').click();
                        }
                        index.alert(_json.message);
                    } else {
                        index.alert(_json.message);
                    }
                })
        }

    },
    taozhuan: function(url, cus_id, over_id) {
        alert(encodeURIComponent(cus_id));
        window.open(url + "?cus_id=" + encodeURIComponent(cus_id) + "&over_id=" + encodeURIComponent(over_id), "记账", "location=0");


    },
    //退出js
    index_tuichu: function(url) {
        index.confirm("确定需要退出系统吗？", {
            enter: function() {
                location.href = url;
            },mask:true
        })
    },
    open_window_onclick: function(id,url,title,ico) {
        var desk_option='{"id":"'+id+'","url":"'+url+'","title":"'+title+'","ico":"'+ico+'"}';
        index.desk.window.close(id);
        index.desk.newWindow($.parseJSON(desk_option));
    },
    //结转
    jiezhang:function(year,month){
        var message="确定要结转到下期吗？"
        index.confirm(message, {
            enter: function() {
                $.ajax({
                        url: "/account/account_closing/captionForward",
                        type: 'post',
                        dataType: 'json',
                        data:{
                            "period_year":year,
                            "period_month":month
                        }
                    })
                    .done(function(_json) {
                        global.ajax.done(_json);
                    })
            },mask:true
        })
    },
    //反结转
     fanjiezhang:function(year,month){
        var message="反结转会计期间将修改为上一期。结转的凭证需手动删除。确定要反结转吗？"
        index.confirm(message, {
            enter: function() {
                $.ajax({
                        url: "/account/account_closing/carryBack",
                        type: 'post',
                        dataType: 'json',
                        data:{
                            "period_year":year,
                            "period_month":month
                        }
                    })
                    .done(function(_json) {
                        global.ajax.done(_json);
                    })
            },mask:true
        })
    }
};
