var math = {
//    加法
    jia: function (arg1, arg2) {
        var r1, r2, length;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        length = Math.max(r1, r2);
        //        debugger;
        return (math.format(arg1, length) + math.format(arg2, length)) / Math.pow(10, length);
    },
//    减法
    jian: function (arg1, arg2) {
        var r1, r2, length;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        length = Math.max(r1, r2);
        return (math.format(arg1, length) - math.format(arg2, length)) / Math.pow(10, length);
    },
//    乘法
    cheng: function (arg1, arg2) {
        var r1, r2, length;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        length = Math.max(r1, r2);
        return (math.format(arg1, length) * math.format(arg2, length)) / Math.pow(10, length * 2);
    },
//    除法
    chu: function (arg1, arg2) {
        var r1, r2, length;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        length = Math.max(r1, r2);
        return (math.format(arg1, length) / math.format(arg2, length));
    },
    //    小数点移动方法
    //    正数右移，负数左移
    format: function (_str, _length) {
        var str = String(_str);
        var length = Math.abs(_length);
        var xiabiao = str.indexOf('.');
        var nowLength;
        var newStr;
        if (_length == 0 || _length == undefined) return Number(_str);

        //            向右移动小数点
        if (_length > 0) {
            if (xiabiao == -1) {
                return Number(str) * Math.pow(10, length);
            }
            //            小数点右边长度
            nowLength = str.slice(xiabiao + 1).length;
            //            长度不够
            if (nowLength < length) {
                //                补全
                str = str + String(Math.pow(10, length - nowLength)).replace('1', '');
            } else if (nowLength > length) {
                //                长度超出
                str = String(Number(str).toFixed(length));
            }
            xiabiao = str.indexOf('.');
            //        替换字符串
            newStr = str.replace(str.slice(xiabiao, xiabiao + length + 1), str.slice(xiabiao + 1, xiabiao + length + 1) + '.');
        } else if (_length < 0) {
            //            向左移动
            if (xiabiao == -1) {
                return Number(str) / Math.pow(10, length);
            }
            //            小数点左边长度
            nowLength = str.slice(xiabiao + 1).length;
            if (nowLength < length) {
                //                补全
                str = String(Math.pow(10, length - nowLength)).replace('1', '') + str;
            }
            xiabiao = str.indexOf('.');
            newStr = str.replace(str.slice(0, xiabiao + 1), '0.' + str.slice(0, xiabiao));
        }
        return Number(newStr);
    },
    toFixed:function(_str,_length){
        var str=String(_str);
        var length=Number(_length);
        var xiabiao=str.indexOf('.');
        var newStr;
        var last;
        if(xiabiao==-1){
            newStr=math.format(math.cheng(str,Math.pow(10,length)),-length);
        }else{
            var tmpStr=str.slice(xiabiao+1);

            if(tmpStr.length==length){
              newStr=str;  
          }else if(tmpStr.length>length){
            newStr=str.slice(0, xiabiao+1+length);
            // console.info(newStr);
            last=str.slice(newStr.length, newStr.length+1);
            if(last>4){
                newStr=math.jia(newStr,math.format(1,-length));
            }
          }else{
            newStr=str;
          }
        }
        var tmp=Number(newStr);
        return tmp.toFixed(_length);
    }
}
