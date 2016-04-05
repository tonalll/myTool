// 新增验证方法
// 三级联动 省份验证
jQuery.validator.addMethod("sheng", function(value, element, param) {
  console.info(element);
  return this.optional(element) || (value != '省份');
}, $.validator.format("请输入省份"));

// 新增class验证 元素有shengsheng类，则进行sheng方法进行验证
jQuery.validator.addClassRules({
  shengsheng: {
    sheng: true
  }
});
