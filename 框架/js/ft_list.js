$(function() {
	$('.tab-title ul li').on({
		click:function(){
			$(this).addClass("selected").siblings().removeClass();//removeClass就是删除当前其他类；只有当前对象有addClass("selected")；siblings()意思就是当前对象的同级元素，removeClass就是删除；
			$(".tab-content > .tab_con").hide().eq($('.tab-title ul li').index(this)).show();
		}
	}); 

});