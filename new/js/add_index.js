//   var index_ceng={
//     index_f:{},
//     index_in:function(_index_class){
//         var index_class=_index_class;
//             $.ajax({
//                 url:'ajax/table_list.html',
//                     dataType:'html'
//                 }).done(function(data){
//                     $(".btu_info").empty();
//                     $(".btu_info").html(data);
//                     /*$(data).find("div").each(function(){
//                         var index_div=$(this).append(data);
//                     $(".add_index").html($(index_div).find(".index_add").html());*/
//             // });
//         });
//     }, 
// }
$(function(){
     $('.data_list_click',&g).each(function(){
        $(this).on({
            click:function(){
                var $nob_add=$(".input_hidden").attr("value");
                $(this).addClass('data-on').siblings().removeClass('data-on');
                $.ajax({
                url:'ajax/table_list.html',
                    dataType:'html'
                }).done(function(data){
                    $(".btu_info").empty();
                    $(".btu_info").html(data);
                });
            }
        });
    });

   $('.ce-btn',&g).on({
        click:function(){
            $('.btu_info').empty();
            $.ajax({
                url:'ajax/table_list.html',
                    dataType:'html'
                }).done(function(data){
                    $(".btu_info").empty();
                    $(".btu_info").html(data);
                });
        }
   });

   
   
   

});