  var index_ceng={
    index_f:{},
    index_in:function(_index_class){
        var index_class=_index_class;
            $.ajax({
                url:'/resource/new/ajax/acc-form.html',
                    dataType:'html'
                }).done(function(data){
                    $(".add_index").html(data);
                   
        });
    },
    
}


$(document).ready(function(){
  $(".acc-table-one").mouseover(function(){
    $(this).css("background","#01746E ");
  });
  $(".acc-table-one").mouseout(function(){
    $(this).css("background","#009D96");
  });



//-----------------------------------所得税测算---------------------------------
         //减
          $("#del_sds").click(function(){
            var nob_add=$("#nob_list_sds").attr("value");
            nob_add==1?nob_add=1:nob_add--;
            $("#nob_list_sds").attr("value",nob_add);
            $.ajax({
                    url:'/ind/sds',
                    dataType:'json',
                    data:{'add_qua':nob_add}
                    }).done(function(data){
                        $("#bjdyj").text(math.toFixed(data.bjdyj,2));
                        $("#bjdsf").text(math.toFixed(data.bjdsf,2));
                        $("#ljsf").text(math.toFixed(data.ljsf,2));
                      });
          });
          
          
          //加
          $("#add_sds").click(function(){
            var nob_add=$("#nob_list_sds").attr("value");
            nob_add==4?nob_add=4:nob_add++;
            $("#nob_list_sds").attr("value",nob_add);
                        $.ajax({
                    url:'/ind/sds',
                    dataType:'json',
                    data:{'add_qua':nob_add}
                    }).done(function(data){
                        $("#bjdyj").text(math.toFixed(data.bjdyj,2));
                        $("#bjdsf").text(math.toFixed(data.bjdsf,2));
                        $("#ljsf").text(math.toFixed(data.ljsf,2));
                      });
          });
          
          //初始化
          $.ajax({
                    url:'/ind/sds',
                    dataType:'json',
                    data:{'add_qua':1},
                    global:false
                    }).done(function(data){
                        $("#bjdyj").text(math.toFixed(data.bjdyj,2));
                        $("#bjdsf").text(math.toFixed(data.bjdsf,2));
                        $("#ljsf").text(math.toFixed(data.ljsf,2));
                      });

//-----------------------------------增值税测算---------------------------------
         $("#del_zzs_1").click(function(){
            var nob_add=$("#nob_list_zzs_1").attr("value");
            nob_add==1?nob_add=1:nob_add--;
            $("#nob_list_zzs_1").attr("value",nob_add);
            $.ajax({
                    url:'/ind/zzs',
                    dataType:'json',
                    global:false,
                    data:{'add_month':nob_add}
                    }).done(function(data){
                        $("#zzsbyyj_1").text(math.toFixed(data.byyjzzs,2));
                        $("#zzsbysf_1").text(math.toFixed(data.bysf,2));
                        $("#zzsljsf_1").text(math.toFixed(data.ljsf,2));
                      });
          });
          
          
          //加
          $("#add_zzs_1").click(function(){
            var nob_add=$("#nob_list_zzs_1").attr("value");
            nob_add==12?nob_add=12:nob_add++;
                        $.ajax({
                    url:'/ind/zzs',
                    dataType:'json',
                    global:false,
                    data:{'add_month':nob_add}
                    }).done(function(data){
                    	if(data.flag=="true"){
    			            $("#nob_list_zzs_1").attr("value",nob_add);
	                        $("#zzsbyyj_1").text(math.toFixed(data.byyjzzs,2));
	                        $("#zzsbysf_1").text(math.toFixed(data.bysf,2));
	                        $("#zzsljsf_1").text(math.toFixed(data.ljsf,2));
                    	}
                      });
          });
          //初始化
          $.ajax({
                    url:'/ind/zzs',
                    dataType:'json',
                    global:false
//                    data:{'add_month':1}
                    }).done(function(data){
                        $("#zzsbyyj_1").text(math.toFixed(data.byyjzzs,2));
                        $("#zzsbysf_1").text(math.toFixed(data.bysf,2));
                        $("#zzsljsf_1").text(math.toFixed(data.ljsf,2));
                        $("#nob_list_zzs_1").attr("value",data.lastP);
                      });          
});


