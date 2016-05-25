(function($) {
    $.fn.revise = function() {
            var recan = {
                name:'revi_val',
                reData:'redata',
                url: '',
                // style:'width:12px;height:20px;background:#22aaa4;color:#fff;text-align:center;'
            };
            var $this=$(this);
            var $reiv_cont=$.parseJSON($this.attr('data-nob'));//获取当前span的data-nob属性 并转换成josn对象
            var $nob_text;
            var $nob_val;
            var $inputTag;
            var this_zz = /^[0-9]*[1-9][0-9]*$/;
            var k13=0;
            recan = $.extend(recan, $reiv_cont);
            $this.on({
                click: function() {
                    $nob_text = $this.text();
                    $this.after('<input class="nob-values" name=""/>');
                    $inputTag=$this.siblings('.nob-values');
                    
                    if ($nob_text == '' || $nob_text == null){
                        $inputTag.val('').focus();
                    }else{
                        if(this_zz.test(parseFloat($nob_text.replace(/,/g,'')))) {
                            $inputTag.val(math.toFixed(parseFloat($nob_text.replace(/,/g,'')),0)).focus();
                           
                        }else{
                            $inputTag.val(math.toFixed(parseFloat($nob_text.replace(/,/g,'')),2)).focus();
                        }
                    }
                    // $inputTag.val($nob_text).focus();
                    $inputTag.trigger('select');
                    $this.hide();
                    $inputTag.attr('name',recan.name);
                    // debugger
                    $inputTag.attr('style',recan.style);
                    //强制所有class为nob-values 的input 只能输入数字和'.'   这一块还需要修改
                    }
            });
                    $this.parent('.nob-name').on({
                        keyup:function(ex){
                            if (ex.keyCode == 13) {
                                k13=1;
                                $inputTag.blur();
                               
                            }else{
                                k13=0;
                                // debugger
                                   //获取recant.regular  正则表达式的字符串
                                    var str_this = recan.regular;
                                    //把字符串转换成正则表达式
                                    var reg = eval(str_this);
                                    $inputTag.val($inputTag.val().replace(reg,''));
                            }
                        },
                        focusout:function(){
                            $nob_val=$inputTag.val(); 
                            if ($nob_val != null && $nob_val != "" && $nob_val < -1000000000 || $nob_val > 1000000000) {
                                index.notice('最大或最小值不能大于或小于1000000000！');
                                $(this).focus();
                                // console.info($(this));
                            }else{
                                if($nob_text==$(this).val()){
                                    // console.info('值没变');
                                    var jiedian= $reiv_cont.reData;
                                    $this.addClass('nob-val-now');
                                        if(jiedian){
                                            // var $re=$this; new Function不允许把对象当成参数来传递
                                            new Function(jiedian+'('+'"nob-val-now",'+k13+')')();
                                        }
                                    $(this).remove();
                                    $this.show();
                                    k13=0;

                                }else{
                                    // console.info('值变了');
                                    var attr_val = $inputTag.parent('.nob-name').attr('data-name');
                                    var realUrl;
                                    var dataUrl=$(this).parents('.table_val_tr').attr('data-url');
                                        if(dataUrl.indexOf("?")>0)
                                        {
                                            realUrl = $('.nob-values').parents('.table_val_tr').attr('data-url') + '&' + attr_val + '=' + $nob_val;
                                        }
                                        else{
                                            realUrl = $('.nob-values').parents('.table_val_tr').attr('data-url') + '?' + attr_val + '=' + $nob_val;
                                        }
                                        $.ajax({
                                                global:false,
                                                url: realUrl,
                                                dataType: 'json'
                                            }).done(function(json) {
                                                    // console.info(json);
                                                    // index.alert('操作成功');
                                                    if($nob_val==''||$nob_val==0){
                                                        $this.text('');
                                                    }else{
                                                        //判断td的类名然后赋值时不保留小数点后两位
                                                        if($this.parent('td').attr('class') == 'nob-name nob_hes')
                                                        {
                                                            $this.text(math.toFixed($nob_val,0));
                                                        }else{
                                                            $this.text(math.toFixed($nob_val,2));
                                                        }
                                                    }
                                                    var jiedian= $reiv_cont.reData;
                                                    $this.addClass('nob-val-now');
                                                    // console.info(jiedian);
                                                    if(jiedian){
                                                        // var $re=$this; new Function不允许把对象当成参数来传递
                                                        new Function(jiedian+'('+'"nob-val-now",'+k13+')')();
                                                    }
                                                    $inputTag.remove();
                                                    $this.show();
                                                    // console.info($(this));
                                                    // index.notice('操作成功');
                                                    k13=0;
                                        }).fail(function(event, xhr, ajaxOptions, thrownError){
                                                        //    console.info(event);
                            //    console.info(xhr);
                            //    console.info(ajaxOptions);
                            //    console.info(thrownError);
                                            index.alert("<div>" + event.responseText + "</div>");
                                        });
                                    }
                                }
                            
                            }
                        
                        },'.nob-values');
        return $this;
    }
})(jQuery)
