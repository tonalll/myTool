$(document).ready(function() {
    // 页面初始化
    $('.package[data-val="' + $('.packageType').val() + '"]').addClass('package-select');



    $('.kaifapiao').on({
        select: function() {
            // console.info('kaifapiao');
            $('.fapiaoInfo').show();
        }
    });
    $('.bukaifapiao').on({
        select: function() {
            // console.info('kaifapiao');
            $('.fapiaoInfo').hide();
        }
    });
    // 地址选择
    _init_area();
    $('#s_county').on({
        change: function() {
            var $this = $(this);
            $(".fapiaodizhiA").val($('#s_province').val() + $('#s_city').val() + $('#s_county').val());
            // console.info($(this).val())
            // console.info($('.fapiaodizhiA').val())
        }
    });
    // 订单类型
    $('.package').each(function(index, el) {
        var $this = $(this);
        $this.on({
            click: function() {
                $this.addClass('package-select').siblings('.package').removeClass('package-select');
                $('.packageType').val($this.attr('data-val'));
                $('.total-price').text($this.find('.price').text());
            }
        });
    });



    $('.dingdan').on({
        submit: function() {
            var $form = $(this);
            // console.info($form.serialize());
            if (!$(':input[name=groupname]').val()) {
                cAlertTop('请输入企业名称！');
                return false;
            }
            if (!$(':input[name=phone]').val()) {
                cAlertTop('请输入联系电话！');
                return false;
            }
            // 验证开发票相关信息
            if ($('.kaifapiao').prop('checked')) {
                if (!$(':input[name="CaptionOrder.fpnr"]').val()) {
                    cAlertTop('请输入发票内容！');
                    return false;
                }
                if (!$(':input[name="CaptionOrder.fptt"]').val()) {
                    cAlertTop('请输入发票抬头！');
                    return false;
                }
                if (!$(':input[name="CaptionOrder.sjr"]').val()) {
                    cAlertTop('请输入收件人姓名！');
                    return false;
                }
                if (!$(':input[name="CaptionOrder.sjrdh"]').val()) {
                    cAlertTop('请输入联系方式！');
                    return false;
                }
                if (!$(':input[name="CaptionOrder.detailaddress"]').val() || $('#s_county').val() == "市、县级市" || $('#s_city').val() == "地级市" || $('#s_province').val() == "省份") {
                    cAlertTop('请输入寄送地址！');
                    return false;
                }
            }
        }
    });

    function cAlertTop(_text) {
        var $alert = $('.c-alert-top');
        $alert.html(_text);
        $alert.show();
        $alert.css('top', -$alert.height());
        $alert.animate({
                top: 0,
            },
            300);
        setTimeout(function() {
            $alert.fadeOut();
        }, 3000);
    }









    //    ----------------------插件类----------------------//
    //    单选多先
    $('input:radio,input:checkbox').each(function() {
        $(this).onoff().hide();
    });
});
