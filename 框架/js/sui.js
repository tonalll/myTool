function sui(_$g) {
	var $g = _$g;

	$('.k_table_cont', $g).each(function(index, el) {
        var $k_table_this = $(this)
        var $k_table_form = $(this).find('form');
        var $k_table_input = $k_table_form.find('.k_table_input');
        var $k_table_month = $('.table_month_list').find('div');
        var $select=$('.table_con_list').find('.m-select');
        var $hasarr = $('.k_table_cont').attr('data-k-table');
        var hasktable = $k_table_this.attr('data-k-start').split(',');
        var haskhas = $k_table_this.attr('data-k-has').split(',');
         $select.on({
            change: function() {
                // console.info('选择年份变化了');
                $k_table_form.submit();

            }
        });
        $k_table_month.each(function(index, el) {
            var $this = $(this);
            $this.on({
                click: function() {
                    $k_table_input.val(index + 1);
                    $k_table_form.submit();
                }
            });
        });
        // 如果当月有凭证，则区别显示
        if (hasktable.length && hasktable[0] != '') {
            for (var i = 0; i < hasktable.length; i++) {
                $k_table_month.eq(hasktable[i] - 1).addClass('hastablek');
            }
        }
        // 如果当月结帐，则区别显示
        if (haskhas.length && haskhas[0] != '') {
            for (var i = 0; i < haskhas.length; i++) {
                $k_table_month.eq(haskhas[i] - 1).addClass('haskhas');
            }
        }

        $k_table_month.eq($hasarr - 1).addClass('k_table_bg');
        if ($k_table_this.attr('data-k-start')) $('.table_month', $k_table_this).eq($k_table_this.attr('data-k-start') - 1).prevAll('.table_month').addClass('noVoucher');

    });


    $('.say_cont', $g).each(function(index, el) {
        var $say_this = $(this);
        var $k_say_form = $(this).find('form');
        var $k_say_input = $k_say_form.find('.k_say_input');
        var $say_select = $say_this.find('.m-select');
        var $k_say_month = $('.say_con_list').find('.say_month');
        var $say_hasarr = $('.say_cont').attr('data-say-table');
        var hasSaytable = $say_this.attr('data-say-start').split(',');
        var hasSayhas = $say_this.attr('data-say-has').split(',');
        $say_select.on({
            change: function() {
                // console.info('选择年份变化了');
                $k_say_form.submit();

            }
        });
        $k_say_month.each(function(index, el) {
            var $this = $(this);
            $this.on({
                click: function() {
                    var monthStr = $this.html();
                    $k_say_input.val(monthStr.substring(0, monthStr.length - 1));
                    // console.info($k_table_form.serialize());
                    // console.info($k_table_input.val());
                    $k_say_form.submit();
                }
            });
        });
        // 如果当月有清单，则区别显示
        if (hasSaytable.length && hasSaytable[0] != '') {
            for (var i = 0; i < hasSaytable.length; i++) {
                //$k_say_month.eq(hasSaytable[i] - 1).addClass('hastablek');
                $k_say_month.each(function(index, el) {
                    var $this = $(this);
                    if ($this.html() == hasSaytable[i] + "月") {
                        $this.addClass('hastablek');
                    }

                });
            }
        }

        // 如果当月清单
        if (hasSayhas.length && hasSayhas[0] != '') {
            for (var i = 0; i < hasSayhas.length; i++) {
                $k_say_month.eq(hasSayhas[i] - 1).addClass('haskhas');
            }
        }
        $k_say_month.each(function(index, el) {
            var $this = $(this);
            if ($this.html() == $say_hasarr + "月") {
                $this.addClass('k_table_bg');
            }

        });
        $k_say_month.eq($say_hasarr + "月").addClass('k_table_bg');
        // $k_table_month.eq($hasarr-1).addClass('k_table_bg');
        if ($say_this.attr('data-say-start')) $('.say_month', $say_this).eq($say_this.attr('data-say-start') - 1).prevAll('.say_month').addClass('noVoucher');
    });


    //点击查看弹出修改框
    $('.k-but-table .k-but-cell', $g).each(function() {
        $(this).find('.k-list-one .btn_select').on({
            click: function() {
                $(this).parents('.k-but-cell').addClass('block_list').siblings().removeClass('block_list');
                if ($(this).attr("name") == "sj") {
                    //计提税金获取税率
                    $.ajax({
                        url: '/account/home_account_closing/showJtsjSl',
                        dataType: 'json'
                    }).done(function(data) {
                        if (data != null) {
                            var jyffjsl = data.jyffjsl;
                            var csjssl = data.csjssl;
                            var dfjyffjsl = data.dfjyffjsl;
                            $('#jyffjsl').val(jyffjsl);
                            $('#csjssl').val(csjssl);
                            $('#dfjyffjsl').val(dfjyffjsl);
                        }
                    });
                } else if ($(this).attr("name") == "xscb") {
                    //计算结转成本百分比
                    $.ajax({
                        url: '/account/home_account_closing/showJzbfb',
                        dataType: 'json'
                    }).done(function(data) {
                        if (data != null) {
                            var jzbfb = data.jzbfb;
                            var zyywsr = data.zyywsr;
                            var kcspye = data.kcspye;
                            $('#jzbfb').val(jzbfb);
                            $('#zyywsr').val(zyywsr);
                            $('#kcspye').val(kcspye);
                        }
                    });
                }else if ($(this).attr("name") == "sds") {
                    //计算所得税税率
                    $.ajax({
                        url: '/account/home_account_closing/showSdssl',
                        dataType: 'json'
                    }).done(function(data) {
                        if (data != null) {
                            var sdssl = data.sdssl;
                            $('#sdssl').val(sdssl);
                        }
                    });
                }
            },
        });
    });

	//测算金额
    $('.ce-btn', $g).on({
        click: function() {
            var $cebtn_info = $('.btu_info');
            var month = $(".k_table_bg").html();
            var year = $("#voucher_year_select").val();
            $cebtn_info.empty();
            $.ajax({
                url: '/account/home_account_closing',
                dataType: 'html',
                data: {
                    month: month,
                    year: year
                }
            }).done(function(data) {
                $cebtn_info.html(data);
                ui($cebtn_info);
            });

        }
    });

                
    $('.k-list-one .amend_list .btn_select', $g).each(function() {
        $(this).on({
	        //默认的金额
	        // $('.amend_list').find('.but_am_money').val();
	        click: function() {
	            //隐藏修改金额div
	            $(this).parent('.k-but-cell').addClass('block_list').siblings().removeClass('block_list');
	            // console.info($(this).parents('.k-but-cell').eq(4));
	            //鼠标离开清空input
	            // $('.amend_list').find('.but_am_money').val("");
	            if ($(this).parents('.k-but-cell').prevAll().nextAll().eq(3) || $$(this).parents('.k-but-cell').prevAll().nextAll().eq(9)) {
	                $('.amend_list').css('background', '#f60');
	            }
	        }
        });
    });

    $('.btn_list_del', $g).on({
        click: function() {
            $(this).parents('.k-but-cell').removeClass('block_list');
        }				
    });

    //点击确定提交修改金额
    $('.btn_list_confirm', $g).each(function() {
        $(this).on({
            click: function() {
                var t = $(this);
                if (t.attr("name") == "sj") {
                    var sj = $("#zzsje").html();
                    var jyffjsl = $('#jyffjsl').val();
                    var csjssl = $('#csjssl').val();
                    var dfjyffjsl = $('#dfjyffjsl').val();
                    $.ajax({
                        url: '/account/home_account_closing/updateJtsjSl',
                        dataType:'json',
                        data: {
                            jyffjsl: jyffjsl,
                            csjssl: csjssl,
                            dfjyffjsl: dfjyffjsl,
                            sj: sj
                        }
                    }).done(function(data) {
                        if (data != null) {
                            var _sj = data.sj;
                            t.parents('.amend_list').siblings().find('.money_info_k').text(_sj);
                        }
                    });
					$(this).parents('.k-but-cell').removeClass('block_list');
				} else if (t.attr("name") == "xscb") {
                    var zyywsr = $('#zyywsr').html();
                    var kcspye = $('#kcspye').html();
                    var jzbfb = $('#jzbfb').val();
                    $.ajax({
                        url: '/account/home_account_closing/updateJzbfb',
                        dataType:'json',
                        data: {
                            zyywsr: zyywsr,
                            kcspye: kcspye,
                            jzbfb: jzbfb
                        }
                    }).done(function(data) {
                        if (data != null) {
                            var _xscb = data.xscb;
                            t.parents('.amend_list').siblings().find('.money_info_k').text(_xscb);
                        }
                    });
                     $(this).parents('.k-but-cell').removeClass('block_list');
                } else if (t.attr("name") == "sds") {
                    var lrze = $('#lrze').html();
                    var sdssl = $('#sdssl').val();
                    $.ajax({
                        url: '/account/home_account_closing/updateSdssl',
                        dataType:'json',
                        data: {
                            sdssl: sdssl,
                            lrze: lrze
                        }
                    }).done(function(data) {
                        if (data != null) {
                            var _jtsj = data.jtsj;
                            t.parents('.amend_list').siblings().find('.money_info_k').text(_jtsj);
                        }
                    });
                     $(this).parents('.k-but-cell').removeClass('block_list');
                }
            },
        });
    });

	
    //清单
    function qdtotal($g) {
        // 计算原值
        var total = 0;
        $('.news_tablebg tr:not(:last)', $g).each(function() {
            var $tr = $(this);
            var thisVal = 0;
            if ($('.orig_value', $tr).length) thisVal = Number($('.orig_value', $tr).text()); //判断是否为p.original_val,thisValde的值 转换成Number，
            else thisVal = Number($('.orig', $tr).val()); //判断是否是input.original
            total += thisVal;
        });
        $('.total_bal', $g).text(total.toFixed(2));
        // 计算期初累计折旧
        var depre_total = 0;
        $('.news_tablebg tr:not(:last)', $g).each(function() {
            var $tr1 = $(this);
            var depreVal = 0;
            if ($('.depr_start', $tr1).length) depreVal = Number($('.depr_start', $tr1).text());
            else depreVal = Number($('.depr', $tr1).val());
            depre_total += depreVal;
        });
        $('.depre_total', $g).text(depre_total.toFixed(2));
        // 计算净值
        var net_total = 0;
        $('.news_tablebg tr:not(:last)', $g).each(function() {
            var $tr = $(this);
            var thisVal = 0;
            if ($('.net_value', $tr).length) thisVal = Number($('.net_value', $tr).text());
            net_total += thisVal;
        });
        $('.net_total', $g).text(net_total.toFixed(2));
        // 计算月折旧额
        var depr_month_total = 0;
        $('.news_tablebg tr:not(:last)', $g).each(function() {
            var $tr = $(this);
            var thisVal = 0;
            if ($('.depr_month', $tr).length) thisVal = Number($('.depr_month', $tr).text());
            depr_month_total += thisVal;
        });
        $('.depr_month_total', $g).text(depr_month_total.toFixed(2));
        // 计算本月折旧
        var depr_month_current_total = 0;
        $('.news_tablebg tr:not(:last)', $g).each(function() {
            var $tr = $(this);
            var thisVal = 0;
            if ($('.depr_month_current', $tr).length) thisVal = Number($('.depr_month_current', $tr).text());
            depr_month_current_total += thisVal;
        });
        $('.depr_month_current_total', $g).text(depr_month_current_total.toFixed(2));
    }


        //判断文本框是否为空
    function isHave(_this) {
        var have = false;
        // debugger
        var start_flag = $("#start_flag").val();
        var input = _this.parents('td').parent('tr').find("input");
        input.each(function(i) {
            var value = $(this).val();
            if ($(this).attr("class") == "data_table_year") {
                
                if (value != null && value != "" && !isDateYyyyMm(value)) {
                    index.notice('输入错误，请输入"yyyyMM"六位数字格式，如"201601');
                    $(this).focus();
                    have = false;
                    return false;
                };
                if (value != null && value != "" && !dateCompare(value,start_flag)) {
                    $(this).focus();
                    have = false;
                    return false;
                }
            }else if ($(this).attr("class") == "right_ft orig") {
                if(value <= 0){
                    index.notice('原值必须大于零！');
                    $(this).focus();
                    have = false;
                    return false;
                }else if(value != null && value != "" && value < 1 || value > 1000000000){
                    index.notice('原值最大不能超过1000000000！');
                    $(this).focus();
                    have = false;
                    return false;
                }
            }else if ($(this).attr("class") == "right_ft age_limit") {
                if (value != null && value != "" && !isPositiveNum(value)) {
                    index.notice('年限必须为正整数');
                    $(this).focus();
                    have = false;
                    return false;
                } else if (value != null && value != "" && (value < 1 || value > 100)) {
                    index.notice('年限必须在1到100之间');
                    $(this).focus();
                    have = false;
                    return false;
                }
            } else if ($(this).attr("class") == "right_ft resi_rate") {
                if (value != null && value != "" && !isPositiveNum(value)) {
                    index.notice('残值率必须为正整数');
                    $(this).focus();
                    have = false;
                    return false;
                } else if (value != null && value != "" && (value < 1 || value > 100)) {
                    index.notice('残值率必须在1到100之间');
                    $(this).focus();
                    have = false;
                    return false;
                }
            }
            if (value == "") {
                have = false;
                //alert('当前输入框不能为空');
                //$(this).focus();
                return false;
            } else {
                have = true;
            }
        })

        return have;
    }

    /**  
    判断输入框中输入的日期格式为yyyymm和正确的日期  
    */
    function isDateYyyyMm(mystring) {
        var reg = /^\b[1-3]\d{3}(0[1-9]|1[0-2])$/;
        var flg = mystring.match(reg);
        if (flg == null) {
            return false;
        } else {
            return true;
        }
    }

    /**  
    判断输入框中输入的日期是否大于当前日期 
    */
    function dateCompare(mystring,start_flag) {
        var y = $(".m-select").val();
        var m = $("#k_say_input").val();
        var this_data=mystring.substring(0,4);
        var this_yue=mystring.substring(4);
        var flg = new Date(this_data,this_yue) - new Date(y,m);
        if(start_flag=='1'){
             if (flg >= 0) {
                index.notice('购买日期应小于当前期间');
                return false;
            } else {
                    return true;
            }
        }else{
            if (flg > 0) {
                index.notice('购买日期应小于或等于当前期间');
                return false;
            } else {
                return true;
            } 
        }
     
    }

    /**计算两个日期之间的月份差*/
    function getMonthNumber(date1, date2) {
        //默认格式为"20030303",根据自己需要改格式和方法
        // 如果像 “201411”这样的日期，在后面自己补上“01”
        var year1 = date1.substr(0, 4);
        var year2 = date2.substr(0, 4);
        var month1 = date1.substr(4, 2);
        var month2 = date2.substr(4, 2);

        var len = (year2 - year1) * 12 + (month2 - month1);
        return len;
    }
    /**判断是否为正整数*/
    function isPositiveNum(s) { //是否为正整数
        var re = /^[0-9]*[1-9][0-9]*$/;
        return re.test(s);
    }


        /**清单行次计算*/
    function calDep(_this) {
        var arry = new Array();
        var start_flag = $("#start_flag").val();
        //        var y = $(".m-select option:selected").val();
        //        var m = $("#k_say_input").val();
        //        var y_m = y + (m < 10 ? "0" + m : m);
        var y_m = $("#dqsxrq").val();
        var y = y_m.substring(0, 4);
        var m = y_m.substring(4);
        var asset_name = ""; //资产名称
        var buy_date = ""; //购买日期
        var orig_value = ""; //原值
        var age_limit = ""; //年限
        var resi_rate = ""; //残值率(%)
        var depr_start = ""; //期初累计折旧
        var net_value = 0; //净值
        var depr_month = 0; //月折旧额  
        var depr_month_current = 0; //本月折旧
        var tds = _this.parents("tr").find("td");
        //if(_this.attr("class")=="name_table_bt"){
        // arry = null;
        // return ;
        //}
        asset_name = tds.eq(1).find("input").val();
        if (typeof(asset_name) == 'undefined') {
            asset_name = tds.eq(1).find("p").html();
        }
        buy_date = tds.eq(2).find("input").val();
        if (typeof(buy_date) == 'undefined') {
            buy_date = tds.eq(2).find("p").html();
        }
        orig_value = tds.eq(3).find("input").val();
        if (typeof(orig_value) == 'undefined') {
            orig_value = tds.eq(3).find("p").html();
        }
        age_limit = tds.eq(4).find("input").val();
        if (typeof(age_limit) == 'undefined') {
            age_limit = tds.eq(4).find("p").html();
        }
        resi_rate = tds.eq(5).find("input").val();
        if (typeof(resi_rate) == 'undefined') {
            resi_rate = tds.eq(5).find("p").html();
        }
        if (buy_date == null || buy_date == "" || orig_value == null || orig_value == "" || age_limit == null || age_limit == "" || resi_rate == null || resi_rate == "") {
            return;
        }

        //月折旧额=（原值-残值）/折旧年限/12
        var cz = parseFloat(orig_value) * (parseFloat(resi_rate) / 100);
        depr_month = (parseFloat(orig_value) - cz) / parseFloat(age_limit) / 12;
        if (depr_month <= 0) {
            depr_month = 0;
        }

        //（新增固定资产年月，当期会计期间年月中间的时间差的月份）*月折旧额=期初折旧额
        var monthD = getMonthNumber(buy_date, y_m) - 1;
        if (monthD < 0) {
            monthD = 0;
        }
        depr_start = parseFloat(monthD) * depr_month;
        if (typeof(tds.eq(6).find("input").val()) == 'undefined') {
        	if(parseFloat(tds.eq(6).find("p").html())==0){
        		tds.eq(6).find("p").html(depr_start.toFixed(2));
        	}else{
        		var monthE = getMonthNumber(tds.eq(10).find("p").html(),y_m);
        		if(tds.eq(10).find("p").html()==buy_date){
        			monthE=monthE-1;
        		}
                if (monthE < 0) {
                	monthE = 0;
                }
                depr_start = parseFloat(monthE) * depr_month;
        		depr_start = depr_start + parseFloat(tds.eq(6).find("p").html());
        		tds.eq(6).find("p").html(depr_start.toFixed(2));
        	}
        } else {
        	if(parseFloat(tds.eq(6).find("input").val())==0){
        		tds.eq(6).find("input").val(depr_start.toFixed(2));
        	}else{
        		depr_start = parseFloat(tds.eq(6).find("input").val());
        	}
        }

        //当月新增的固定资产的期初累计折旧额默认为0
        if (parseFloat(tds.eq(6).find("input").val())==0 && y_m == buy_date) {
            depr_start = 0;
        }

        //净值=原值-累计折旧
        net_value = parseFloat(orig_value) - parseFloat(depr_start);
        if (net_value <= 0) {
            net_value = 0;
        }

        //本月折旧额判断=本月折旧额的判断（净值-残值《原值*残值率》-月折旧额＞0则取月折旧额的数，若＜0则取净值--残值的余额，则下月不在计提折旧） 
        if ((net_value - cz - depr_month) > 0) {
            depr_month_current = depr_month;
        } else {
            depr_month_current = net_value - cz;
        }
        if (depr_month_current <= 0) {
            depr_month_current = 0;
        }
        //------当月新增的固定资产不计提折旧（默认当月的折旧额为0）
        if (y_m == buy_date) {
            depr_month_current = 0;
        }
        tds.eq(7).html('<p class="right_ft net_value">' + net_value.toFixed(2) + '</p>');
        tds.eq(8).html('<p class="right_ft depr_month">' + depr_month.toFixed(2) + '</p>');
        tds.eq(9).html('<p class="right_ft depr_month_current">' + depr_month_current.toFixed(2) + '</p>');
        //        var newDate = new Date().getFullYear() + ((new Date().getMonth() + 1) < 10 ? "0" : "") + (new Date().getMonth() + 1);
        var newDate = y_m;
        if (tds.eq(10).find("p").length == 0) {
            tds.eq(10).html('<p class="right_ft">' + newDate + '</p>');
        }

        var id = tds.eq(0).find("input").val();
        if (id == null || id == "" || id == 0) {
            create_date = y_m;
        } else {

            create_date = tds.eq(10).find("p").html();
        }

        arry[0] = id;
        arry[1] = y;
        arry[2] = m;
        arry[3] = asset_name;
        arry[4] = buy_date;
        arry[5] = orig_value;
        arry[6] = age_limit;
        arry[7] = resi_rate;
        arry[8] = depr_start;
        arry[9] = net_value;
        arry[10] = depr_month;
        arry[11] = depr_month_current;
        arry[12] = create_date;
        arry[13] = start_flag;
        return arry;

    }


    //初始化清单合计
    if ($('.news_tablebg', $g).length) {
        $('.news_tablebg tr', $g).each(function() {
            var tds = $(this).find("td");
            var buy_date = tds.eq(2).find("p").html();
            var y = $(".m-select").val();
            var m = $("#k_say_input").val();
            var y_m = y + (m < 10 ? "0" + m : m);
            var f = (y_m != buy_date);
            if (f) {
                calDep(tds.eq(0));
            }

        });
        qdtotal($g);
    }

    // 删除
    $('.news_tablebg', $g).on({
        click: function() {
            var id = $(this).parents("tr").find("td").find("input").val();
            if (id == null || id == "0" || id == 0) {
                index.alert("该行记录不能删除!");
                return;
            }
            // 删除
            var num = $('.news_tablebg tr').nextAll().length,
                max = $('.news_tablebg tr').length;
            if (num == 0) {
                $(".news_tablebg table tr").eq(-1).find('td input').empty();
            } else {
                $(this).parents('tr').remove();
                $('.news_tablebg tr:not(:last)', $g).each(function() {
                    var long_tr = $('.news_tablebg tr:not(:last)').length;
                    var a = $(".news_tablebg table tr").eq(-2).find('td:eq(0)').find('input').val();
                    var htm = "<input type=hidden value=" + a + " />";
                    $(".news_tablebg table tr").eq(-2).find('td:eq(0)').html("" + long_tr + htm);
                });
            }

            $.ajax({
                url: "/account/account_depreciation_list/delete",
                data: {
                    id: id
                },
                dataType: 'json'
            }).done(function(json) {

            });

            qdtotal($g);
        }
    }, '.btn_del_pos');

    //清空
    $('.news_tablebg', $g).on({
        click: function() {
            var list_text = $(this).parents('tr').find('td .right_ft');
            var info_no = 0
            if (list_text.val() !== '') {
                list_text.val(info_no);
                list_text.text(info_no);
            }
            qdtotal($g);
        }
    }, '.btn_empty');

    //还原数据
    $('.news_tablebg', $g).on({
        click: function() {
            $.ajax({
                url: '/resource/new/ajax/acc-data.json',
                dataType: 'json'
            }).done(function(json) {
                $('.this1').val(json.income);
                $('.this2').val(json.bigincome);
                $('.data_table_year').val(json.addincome);
                $('.this4').val(json.fourincome);
                $('.this5').val(json.fiveincome);
                $('.this6').val(json.sixincome);
                $('.this7').val(json.sevenincome);
            });
            qdtotal($g);
        }
    }, '.btn_restore');

	$('.news_tablebg tr td input',$g).on({
		keyup:function(event){
			if (event.keyCode == 13) {
	            //这里写你要执行的事件;
	            $(this).parent('td').next().find('input').focus();
	        }
		}
	});
    
    //新增清单明细
    $('.news_tablebg', $g).on({
        blur: function() {
            qdtotal($g);
            var hava = isHave($(this));
        }
    }, 'input');
    
    $('.news_tablebg', $g).on({
        click: function() {
            var data_va=$(this).parents('tr').find('input');
            var hava = isHave(data_va);
            if (hava) {
                var th_1 = $(this).parents('td').parent('tr').nextAll().length;
                if (th_1 == 1) {
                    var addend_text = $(".news_tablebg>table tr.list_add").html();
                    $(".news_tablebg>table tr").eq(-2).after('<tr class="list_add">' + addend_text + '</tr>');
                    $('.news_tablebg tr:not(:last)', $g).each(function() {
                        var long_tr = $('.news_tablebg tr:not(:last)').length;
                        $(".news_tablebg table tr").eq(-2).find('td:eq(0)').html("" + long_tr + '<input type="hidden" value="0" />');
                        $(".news_tablebg table tr").eq(-2).find('input:not(:last):not(:eq(2)):not(:eq(0))').val('');
                        $(".news_tablebg table tr").eq(-2).find('td:eq(7)').nextUntil('td:last()').prev().html('');
                    });
                }
            } else {
                // index.alert("请将输入框内容填写完整");
                return;
            }
            /*行次计算开始*************************/
            var _td = $(this);
            var arry = calDep(_td);
            var id = arry[0];
            var y = arry[1];
            var m = arry[2];
            var asset_name = arry[3];
            var buy_date = arry[4];
            var orig_value = arry[5];
            var age_limit = arry[6];
            var resi_rate = arry[7];
            var depr_start = arry[8];
            var net_value = arry[9];
            var depr_month = arry[10];
            var depr_month_current = arry[11];
            var create_date = arry[12];
            var start_flag = arry[13];
            $.ajax({
                url: "/account/account_depreciation_list/save",
                data: {
                    id: id,
                    period_year: y,
                    period_month: m,
                    asset_name: asset_name,
                    buy_date: buy_date,
                    orig_value: orig_value,
                    age_limit: age_limit,
                    resi_rate: resi_rate,
                    depr_start: depr_start,
                    net_value: net_value,
                    depr_month: depr_month,
                    depr_month_current: depr_month_current,
                    create_date: create_date,
                    start_flag: start_flag
                },
                dataType: 'json'
            }).done(function(json) {
                _td.parents("tr").find("td").eq(0).find("input").val(json.id);
            });
            /*行次计算结束*************************/
            // alert("输入完整");
            // console.info($(this).parents('tr').siblings('tr').eq(-2));
            // $(this).parents('tr').siblings('tr').eq(-2).find()
            qdtotal($g);
        }
    }, '.btn_add_pos');
    
    
    //期初余额数量核算
    var c=0;
    $('.m-nob-botton',$g).on({
        click:function(){
                $(this).parents('.m-tab-con').siblings('.m-tab-bar').find('.m-tab-button').each(function(this_url,index){
                    var true_a='this_true';
                    var fals_b='this_fals';
                    var this_ysurl=$(this).attr('data-url');
                    this_ysurl=this_ysurl.substring(0,this_ysurl.length-10);
                    var data_urlthis=$(this).attr('data-url');
                    data_urlthis=data_urlthis.substring(95,data_urlthis.length);
                    if(data_urlthis=='this_fals'){
                        $(this).attr("data-url",this_ysurl);
                        $(this).parents('.m-tab-bar').siblings('.m-tab-con').find('.m-nob-botton').addClass('h-sbotton');
                        $(this).parents('.m-tab-bar').siblings('.m-tab-con').find('.nob_hes').show();
                        // $(this).parents('.m-tab-bar').siblings('.m-tab-con').find('.nob_hes').show();
                        var this_zzz = $(this).attr('data-url')+'='+true_a;
                        $(this).attr("data-url",this_zzz);
                        $('.nob_hes').css({'width':'90'});
                    }else{
                        $(this).attr("data-url",this_ysurl);
                        $(this).parents('.m-tab-bar').siblings('.m-tab-con').find('.m-nob-botton').removeClass('h-sbotton');
                        $(this).parents('.m-tab-bar').siblings('.m-tab-con').find('.nob_hes').hide();
                        // $(this).parents('.m-gridBar').siblings('.m-grid-head').find('.nob_hes').hide();
                        var this_zzz = $(this).attr('data-url')+'='+fals_b;
                        $(this).attr("data-url",this_zzz);
                        $('.nob_hes').css({'width':'0'});
                    }
                });
        }
    });



    //发票管理


    $('#certi_bt',$g).on({
        click: function() {
            var $in_infocont = $('.invoice_btinfo');
            var in_month = parseInt($("#in_month").html());
            var in_year = parseInt($("#in_year").html()); 
            $in_infocont.empty();
            $.ajax({
                url: '',
                dataType: '',
                data: {
                    in_month: in_month,
                    in_year: in_year
                }
            }).done(function(data) {
                $in_infocont.html(data);
                ui($in_infocont);
            });

        }
    });

    $('#output_bt',$g).on({
        click: function() {
            var $in_infocont = $('.invoice_btinfo');
            var in_month = parseInt($("#in_month").html());
            var in_year = parseInt($("#in_year").html()); 
            $in_infocont.empty();
            $.ajax({
                url: '',
                dataType: '',
                data: {
                    in_month: in_month,
                    in_year: in_year
                }
            }).done(function(data) {
                $in_infocont.html(data);
                ui($in_infocont);
            });

        }
    });
    //初始化
    // $('#certi_bt',$g).click();
    
    $('.invoice_lt_info').on({
        mouseover:function(){
            $(this).find('.header_del_in').show();
        },
        mouseleave:function(){
            $(this).find('.header_del_in').hide();
        }
    });


    //删除进项发票
    $('.jxfp-delete').on({
            click: function() {
            	 var $this = $(this);
                index.confirm('是否确认删除发票？', {
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
    
  //删除进项发票
    $('.xxfp-delete').on({
            click: function() {
            	var $this = $(this);
                index.confirm('是否确认删除发票？', {
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


  //发票明细填写

    function IsNumeric(sText)
    {
       var ValidChars = "0123456789.";
       var IsNumber=true;
       var Char;
       for (i = 0; i < sText.length && IsNumber == true; i++) 
          { 
          Char = sText.charAt(i); 
          if (ValidChars.indexOf(Char) == -1) 
             {
             IsNumber = false;
             }
          }
       return IsNumber;
       
    };
    /**
     * 合计金额
     */
    function calcHjje() {
          	var totalPallets = 0;

        $(".total_money-input").each(function() {
        
            var thisValue = $(this).val();
        
            if ( (IsNumeric(thisValue)) &&  (thisValue != '') ) {
            	
            	totalPallets += parseFloat(thisValue);
            
            };
        
        });
        
        $("#jx_money").val(totalPallets.toFixed(2));

    };

    /**
     * 合计税额
     */
    function calcHjse() {
        	var totalPallets = 0;

        $(".tax_money-input").each(function() {
        
            var thisValue = $(this).val();
        
            if ( (IsNumeric(thisValue)) &&  (thisValue != '') ) {
            
            	totalPallets+= parseFloat(thisValue);
            
            };
        
        });
        
        $("#jx_tax_money").val(totalPallets.toFixed(2));

    };
    /**
     * 价税合计
     */
    function calcJshj(){
    	 var orderTotal = 0;

    	    var productSubtotal = $("#jx_money").val() || 0;
    	    var shippingSubtotal = $("#jx_tax_money").val() || 0;
    	        
    	    var orderTotal = parseFloat(productSubtotal) + parseFloat(shippingSubtotal);
//    	    var orderTotalNice = "$" + orderTotal;
    	    
    	    $("#tax_total").val(orderTotal.toFixed(2));
    }

    /**
     * 发票模块录入时自动计算
     */
  
    	$('.invo_table.add_cont_inp tbody tr').click(function(){
    	//	$(this).attr("style","background-color:red");
    	$(this).siblings("tr").each(function(){
    		var tax_money=$(this).find(".total_money-input").val();
    		if($.trim(tax_money)==''||$.trim(tax_money)==0){
    			$(this).find(".tax_rate-input").val('');
    		}
    	});
    	 var tax_rate=$(this).find(".tax_rate-input").val();
    		if($.trim(tax_rate)==''||$.trim(tax_rate)==0){
    			$(this).find(".tax_rate-input").val(17);
    		}
    	});
    	/**
    	 * 数量--失去焦点
    	 */
    	$('.amount-input').blur(function(){
            var $this = $(this);
            var numPallets = $this.val();
            if(!IsNumeric(numPallets)){//不是数字就空
            	$this.val('');
            	return;
            }
            var multiplier = $this
                                .parent().parent()
                                .find(".price-input")
                                .val();
            if($.trim(multiplier)==''){//单价为空，不计算
            	return;
            }
            
            if ( (IsNumeric(numPallets)) && (numPallets != '') ) {
                
                var rowTotal = numPallets * multiplier;
                
                $this
                    //.css("background-color", "white")
                    .parent().parent()
                    .find(".total_money-input")
                    .val(rowTotal.toFixed(2));  
                
                var tax_rate=($this
    	            //.css("background-color", "white")
    	            .parent().parent()
    	            .find(".tax_rate-input")
    	            .val()/100).toFixed(2);
                
                $this
    	            //.css("background-color", "white")
    	            .parent().parent()
    	            .find(".tax_money-input")
    	            .val((rowTotal.toFixed(2)*tax_rate).toFixed(2));
                
                
            } else {
            
             //   $this.css("background-color", "#ffdcdc"); 
                            
            };
            
            calcHjje();
            calcHjse();
            calcJshj();
    	});
    	
    	/**
    	 * 单价--失去焦点
    	 */
    	$('.price-input').blur(function(){
            var $this = $(this);
            var numPallets = $this.val();
            if(!IsNumeric(numPallets)){//不是数字就空
            	$this.val('');
            	return;
            }
            var multiplier = $this
                                .parent().parent()
                                .find(".amount-input")
                                .val();
            if($.trim(multiplier)==''){//数量为空，不计算
            	return;
            }
            
            if ( (IsNumeric(numPallets)) && (numPallets != '') ) {
                
                var rowTotal = numPallets * multiplier;
                
                $this
                    .parent().parent()
                    .find(".total_money-input")
                    .val(rowTotal.toFixed(2));  
                
                
                var tax_rate=($this
        	            .parent().parent()
        	            .find(".tax_rate-input")
        	            .val()/100).toFixed(2);
                
                $this
    	            .parent().parent()
    	            .find(".tax_money-input")
    	            .val((rowTotal.toFixed(2)*tax_rate).toFixed(2));
                
                
            }
            
            calcHjje();
            calcHjse();
            calcJshj();
    	});
    	
    	/**
    	 * 金额--失去焦点
    	 */
//    	$('.total_money-input').blur(function(){
//            var $this = $(this);
//            var numPallets = $this.val();
//            var  je=$this.parent().parent()
//            .find(".price-input").val();
//            
//            if(!IsNumeric(numPallets)||$.trim(numPallets)!=''){//不是数字就空
//            	$this.val('');
//            	return;
//            }
//            $this.val((numPallets*1).toFixed(2));
//            numPallets=(numPallets*1).toFixed(2);
//            var multiplier = $this
//                                .parent().parent()
//                                .find(".amount-input")
//                                .val();
//            if($.trim(multiplier)==''){//数量为空，不计算
//            	return;
//            }
//            
//            if ( (IsNumeric(numPallets)) && (numPallets != '') ) {
//                
//                var rowTotal = numPallets / multiplier;
//                
//                $this
//                    .parent().parent()
//                    .find(".price-input")
//                    .val(rowTotal.toFixed(2));  
//                
//                
//                var tax_rate=($this
//        	            .parent().parent()
//        	            .find(".tax_rate-input")
//        	            .val()/100).toFixed(2);
//                
//                $this
//    	            .parent().parent()
//    	            .find(".tax_money-input")
//    	            .val((numPallets*tax_rate).toFixed(2));
//                
//                
//            }
//            
//            calcHjje();
//            calcHjse();
//            calcJshj();
//    	});
    	/**
    	 * 税率--失去焦点
    	 */
    	$('.tax_rate-input').blur(function(){
            var $this = $(this);
            var numPallets = $this.val();
            if(!IsNumeric(numPallets)){//不是数字就空
            	$this.val('');
            	return;
            }
            var multiplier = $this
                                .parent().parent()
                                .find(".total_money-input")
                                .val();
            if($.trim(multiplier)==''){//金额为空，不计算
            	return;
            }
            
            if ( (IsNumeric(numPallets)) && (numPallets != '') ) {
                
//                var rowTotal = numPallets * multiplier;
                
               var rowTotal= $this
                    .parent().parent()
                    .find(".total_money-input")
                    .val();  
                
                
                var tax_rate=($this
        	            .parent().parent()
        	            .find(".tax_rate-input")
        	            .val()/100).toFixed(2);
                
                $this
    	            .parent().parent()
    	            .find(".tax_money-input")
    	            .val((rowTotal*tax_rate).toFixed(2));
                
                
            }
            
            calcHjje();
            calcHjse();
            calcJshj();
    	});
   

    	//提交发票内容时检查明细不能为空
        $('.fp-submit').each(function(i, e) {
            var $this = $(this);
            $this.on({
                click: function() {
                	var amount='';
                	var price='';
                	var total_money='';
                	var tax_rate='';
                	var tax_money='';
                	var flag=false;
                	var $form =$this.parent().parent();
                	var rq='';
                	var num='';
                	var name='';
                	var mark=false;
                	var word='';
                	$form.find('.l-fields').each(function(){
                		rq=$(this).find('.l-field .vch_date').val();
                		num=$(this).find('.l-field .num').val();
                		name=$(this).find('.l-field .name').val();
                		if($(this).find('.l-field .name').attr("name")=='JxInvAuth.sell_name'){
                			word="供应商名称";
                		}else{
                			word="客户名称";
                		}
                	});
                	if($.trim(rq)!=''&&$.trim(num)!=''&&$.trim(name)!=''){
                		mark=true;
                	}
                	if(!mark){
                		index.notice("亲,日期、发票号、"+word+"不能为空哦！");
                		return;
                	}
                	$('.invo_table.add_cont_inp tbody tr').each(function(){
                		   amount=$(this).find('td input.amount-input').val();
                		if(typeof(amount) !='undefined'){
                    		price=$(this).find('td input.price-input').val();
                    		total_money=$(this).find('td input.total_money-input').val();
                    		tax_rate=$(this).find('td input.tax_rate-input').val();
                    		tax_money=$(this).find('td input.tax_money-input').val();
                    		if($.trim(amount)!=''&&$.trim(price)!=''&&$.trim(total_money)!=''&&$.trim(tax_rate)!=''&&$.trim(tax_money)!=''){
                    			flag=true;
                    		}
                		}
                		
                	});
                	if(flag){
                		$form.submit();
                	}else{
//                		if($.trim(amount)==''){
//                			index.notice("亲，数量不能为空");
//                		}else if($.trim(price)==''){
//                			index.notice("亲，单价不能为空");
//                		}else if($.trim(total_money)==''){
//                			index.notice("亲，金额不能为空");
//                		}else if($.trim(tax_rate)==''){
//                			index.notice("亲，税率不能为空");
//                		}else if($.trim(tax_money)==''){
//                			index.notice("亲，税额不能为空");
//                		}
                		index.notice("亲,明细行数据不能为空，请填写完整！");
                		return;
                	}
                	
                }
            });
        });
        //发票认证测算
        $('.fprzcs').on({
        	click: function() {
        	    var flag=$(this).attr('flag');
        	    var year = $("#general_ledger_year").val();
                var s_month = $("#general_ledger_s_month").val();
                var e_month=$("#general_ledger_e_month").val();
                if (s_month> e_month) {
                    index.alert("亲，起始日月份不能大于终止月份！");return;
                }
            	 dialog.open($.parseJSON("{\"width\":\"80%\",\"height\":\"80%\",\"title\":\"发票认证测算\",\"url\":\"/fapiao/jxfp?flag="+flag+"&year=" +year + "&s_month=" +s_month+"&e_month=" +e_month+"\"}"));
            	 $(".fprzcs").unbind("click"); 
              }
        });
       
        // 进项发票认证时批量选择 --点击保存
        $('.fprzcsbc').on({
                click: function() {
                 var $this = $(this);
                    var dataId = '';
                    var $select = $('table.unit.bg.select');
                    $select.each(function(index, index) {
                        if ($select.length - 1 == index) dataId += $(this).attr('data-id');
                        else dataId += $(this).attr('data-id') + ',';
                    });
                    if($.trim(dataId)==""){
                    	  index.alert("亲，你还没有选择发票哦！");return;
                    }
                    $.ajax({
                        url: "/fapiao/fprzcs",
                        data: {
                        	auth_ids: dataId,
                            flag:$select.attr('flag')
                        },
                        dataType: 'json'
                    }).done(function(json) {
                    	 global.ajax.done(json);
                    });
                }
            });
        //发票点击事件，发送ajax，实时认证测算
        $('table.unit.bg').each(function(index, el) {
            var $this = $(this);
           var auth_res= $this.attr('auth_res');
            if(auth_res=='1'){
            	$this.addClass('select');
            }
            $this.on({
                click: function() {
                    var dataId = '';
                    var sdate='';
                    var edate='';
                    var $select = $('table.unit.bg.select');
                    $select.each(function(index, index) {
                        if ($select.length - 1 == index) dataId += $(this).attr('data-id');
                        else dataId += $(this).attr('data-id') + ',';
                    });
                    sdate=$this.attr('sdate');
                    edate=$this.attr('edate');
                    $.ajax({
                        url: "/fapiao/realTimeCalcZzs",
                        data: {
                            auth_ids: dataId,
                            sdate:sdate,
                            edate:edate
                        },
                        dataType: 'json'
                    }).done(function(json) {
                    	  $(".fptj").empty();
                    	  var html='';
                    	  if(typeof(json.xxse)=="undefined"&&typeof(json.rzjxse)=="undefined"){
                              html=" <span>销项税额：0.00 元</span><span>认证进项税额：0.00 元</span><span>预计应交增值税：0.00  元</span><span>	预计税负：0.00%</span>";
                    	  }else if(typeof(json.xxse)=="undefined"){
                             html=" <span>销项税额：0.00 元</span><span>认证进项税额："+json.rzjxse+" 元</span><span>预计应交增值税：0.00  元</span><span>	预计税负：0.00%</span>";
                    	  }else{
                            html=" <span>销项税额："+json.xxse+" 元</span><span>认证进项税额："+json.rzjxse+" 元</span><span>预计应交增值税："+json.yjZzs+" 元</span><span>	预计税负："+json.yjsf+" %</span>";
                    	  }
                    	  $(".fptj").append(html);
                    });
                }
            });
        });

}
