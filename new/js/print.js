$(document).ready(function() {
    var browser;
    var userAgent = navigator.userAgent;
    if (!!window.ActiveXObject || "ActiveXObject" in window) browser = 'ie';
    // if (userAgent.indexOf("Firefox") > -1) browser = 'firefox';
    if (browser == 'ie') $('body').addClass('ie');
    // if(browser=='firefox') $('body').addClass('firefox');
    $('.print').on({
        click: function() {
            window.print();
        }
    });
    // 分页初始化
    // 需要分页的class为body的div添加data-maxLine属性，标记最大行数
    $('.body').each(function(index, el) {
        var $body = $(this);
        var className = 'body' + index + '-' + Math.random().toString().slice(2);
        var maxLine = $body.attr('data-maxLine');
        if ($body.is('.voucher')) {
            // 凭证打印
            $body.find('.voucher-layout').each(function(index, el) {
                var $voucherLayout = $(this);
                className = 'voucher' + index + '-' + Math.random().toString().slice(2);
                $voucherLayout.addClass(className);
                var $tds = $voucherLayout.find('tbody tr');
                if ($tds.length > 5) {
                    // 对凭证进行分割、分页
                    myprint.voucherFenye($voucherLayout, className);
                } else {
                    myprint.voucher5tr($voucherLayout);
                }
                // 填充分页
                var $allPage = $('.' + className);
                $allPage.each(function(index, el) {
                    // console.info(index);
                    var text = $(this).find('.yema').text();
                    if ($allPage.length > 1) $(this).find('.yema').text(text + '(' + (index + 1) + '/' + $allPage.length + ')');
                });
            });
            // 对页面进行分割
            if ($body.find('.voucher-layout').length > 2) myprint.voucherPage($body);
        } else {
            // 其它报表打印
            if (!maxLine) return;
            $body.addClass(className);
            if ($body.find('tbody tr').length > maxLine) {
                // 需要分页
                // console.info('需要分页！');
                myprint.fenye($body, className);

            } else {
                // 不需要分页
                // console.info('不需要分页！');
            }
            // 填充页码
            $('.' + className).each(function(index, el) {
                $(this).find('.yema').text('第' + (index + 1) + '页 共' + $('.' + className).length + '页');
            });
        }
    });

});
/*setTimeout(function() {
    location.reload(true);
}, 1000 * 60 * 50);
// }, 1000 * 3);
// }, 1000 * 6);
var timeTmp = 0;
setInterval(function() {
    timeTmp++;
    console.info('------' + timeTmp + '分钟');
}, 1000 * 60);*/

/*
关于打印功能的技术调研
1.没有现成的免费第三方浏览器插件可用
2.使用js直接打印，需要用户手动设置大小（ie）、页眉页脚（非ie）等；
3.使用js插件jsPDF转换成pdf打印，ie要求9及以上版本。
*/
var myprint = {
    fenye: function(_$body, _className) {
        var $body = _$body;
        var className = _className;
        var maxLine = $body.attr('data-maxLine');
        var $clone = $body.clone();
        $body.after($clone).after($body.prev('.divider').clone());
        var $newBody = $('.' + className).last();
        $body.find('tbody tr:gt(' + (maxLine - 1) + ')').remove();
        $newBody.find('tbody tr:lt(' + (maxLine) + ')').remove();
        if ($newBody.find('tbody tr').length > maxLine) myprint.fenye($newBody, className);

    },
    voucherPage: function(_$body) {
        var $body = _$body;
        var $clone = $body.clone();
        $body.after($clone).after($body.prev('.divider').clone());
        var $newBody = $body.next().next();
        // console.info($newBody);
        $body.find('.voucher-layout:gt(1)').remove();
        $newBody.find('.voucher-layout:lt(2)').remove();

        // console.info($newBody.find('.voucher-layout').length > 2);
        if ($newBody.find('.voucher-layout').length > 2) myprint.voucherPage($newBody);

    },
    voucher5tr: function(_$voucherLayout) {
        var $voucherLayout = _$voucherLayout;
        if ($voucherLayout.find('tbody tr').length < 5) $voucherLayout.find('tbody tr').last().after('<tr><td></td><td></td><td></td><td></td></tr>');
        else return;
        myprint.voucher5tr($voucherLayout);
    },
    voucherFenye: function(_$voucherLayout, _className) {
        var $voucherLayout = _$voucherLayout;
        var className = _className;
        var $clone = $voucherLayout.clone();
        $voucherLayout.after($clone);
        var $newVoucherLayout = $voucherLayout.next();
        $voucherLayout.find('tbody tr:gt(' + 4 + ')').remove();
        $newVoucherLayout.find('tbody tr:lt(' + 5 + ')').remove();
        if ($newVoucherLayout.find('tbody tr').length > 5) {
            myprint.voucherFenye($newVoucherLayout, className);
        } else {
            myprint.voucher5tr($newVoucherLayout);
        }

    }
};
