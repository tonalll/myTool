//    文件上传
//    封闭于WebUploader插件
//    api http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_events
// 返回json
/*
    {"state": "SUCCESS","title": "1446773774767006008.png","original": "FW-\u52a8\u753b-\u6548\u679c.fw.png"
,"type": ".png","url": "/ueditor/jsp/upload/file/20151106/1446773774767006008.png","size": "189148"}*/
/*
<div>
            <div upload-options="fileNumLimit:10,threads:1,swf:'/resource/ueditor/third-party/webuploader/Uploader.swf',server:'${root!}/customer/uploaddazlFile',upButton:'myupbutton',fileList:'mylist',resize: false,pick:'#myupload' ,accept:{title: 'excel,jpg',extensions:'zip,gif,jpg,jpeg,bmp,png,xls,xlsx', mimeTypes: '*.zip,image/*,application/vnd.ms-excel'}" id="myupload">选择上传附件</div>
            <div class="m-button" id="myupbutton" >上传</div>
        </div>
        <div id="mylist">
        </div>

        <div id="mylist" class="fileListLayout">
    <div id="WU_FILE_1" class="fileUnit fileUnitOk">
        <div class="fileSuccess" style="display: inline-block;">&nbsp;</div>
        <div class="fileName">ubuntu.png</div>
        <div class="fileCancel">&nbsp;</div>
        <div class="fileError"></div>
        <div class="fileProcessBar" style="opacity: 0.5; width: 100%; display: none;"></div>
    </div>
</div>
文件上传相关
.upload{display: inline-block;}
.fileUnit{padding: 0.5em;border: 1px solid #ddd;display: inline-block;margin-right: 0.5em;margin-top: 0.5em;position: relative;}
.fileUnitOk{border-color: #459ACB;background: #C7E1EF;}
.fileUnitErrot{background: #f00;}
.fileUnitErrot .fileError{display: inline-block;}
.fileUnit *{display:inline-block;}
.fileSuccess{display: none;width: 20px;background: url(../easyui/themes/icons/accept.png) center center no-repeat;}
.fileName{}
.fileCancel{cursor: pointer;width: 20px;background: url(../easyui/themes/icons/cancel.png) center center no-repeat;}
.fileError{display: none;}
.fileProcessBar{position: absolute;left: 0;bottom: 0;height: 100%;width: 0;background: #459ACB;}
.fileListLayout{margin-bottom: 0.5em;}
        */
$('[upload-options]', $g).each(function() {
  var $thisUpload = $(this);
  $thisUpload.addClass('upload');
  var options = $.zJSON($(this).attr('upload-options'));
  var uploader;
  var $listLayout = $('#' + options.fileList).addClass('fileListLayout');
  // console.info(options);
  //        初始化文件上传组件
  uploader = WebUploader.create(options);
  //        初始化上传按钮

  window.tmp = uploader;
  $('#' + options.upButton).on({
    click: function() {
      uploader.upload();
    }
  }).css({
    overflow: 'hidden'
  });
  //        对初始化的文件进行删除绑定
  $listLayout.find('.fileUnit').each(function() {
    var $fileUnit = $(this);
    $fileUnit.find('.fileCancel').one('click', function() {
      $fileUnit.remove();
      if ($('#files_' + $fileUnit.attr('id')).length) $('#files_' +
        $fileUnit.attr('id')).remove();
      $fileUnit.remove();
    });
  });

  uploader.on('beforeFileQueued', function(file) {
    // console.info('----------',options);
    if ($listLayout.find('.fileUnit').length == options.fileNumLimit) {
      index.alert("最多只能上传" + options.fileNumLimit + "个!");
      return false;
    }
  });
  //        文件加入上传序列
  uploader.on('fileQueued', function(file) {
    // console.info(file.fileNumLimit);
    $listLayout.append('<div class="fileUnit" id="' + file.id +
      '"><div class="fileSuccess">&nbsp</div><div class="fileName">' +
      file.name +
      '</div><div class="fileCancel">&nbsp</div><div class="fileError"></div><div class="fileProcessBar"></div></div>'
    );
    //            //console.info('文件数量', file);
    //            取消上传和删除已上传
    var $fileUnit = $('#' + file.id);
    $fileUnit.find('.fileCancel').one('click', function() {
      if ($('#files_' + file.id).length) $('#files_' + file.id).remove();
      $fileUnit.remove();
      uploader.removeFile(file, true);
    });
    $('#' + file.id).find('.fileProcessBar').fadeTo(10, 0.5);
  });
  //        文件上传进度显示
  uploader.on('uploadProgress', function(file, percentage) {
    $('#' + file.id).find('.fileProcessBar').css({
      width: percentage * 100 + '%'
    });
    if (percentage == 1) $('#' + file.id).find('.fileProcessBar').hide();
    //            //console.info(file);
    //            //console.info(percentage);
  });
  //        文件上传成功{}
  uploader.on('uploadSuccess', function(file, data) {
    $('#' + file.id).find('.fileSuccess').css({
      display: 'inline-block'
    });
    $thisUpload.after(
      '<input type="hidden" name="files" value="" id="files_' + file.id +
      '">');
    var $fileInput = $('#files_' + file.id);
    $fileInput.val(data.original + '||' + data.type + '||' + data.url +
      '||' + data.size);
    $('#' + file.id).addClass('fileUnitOk');
    //            //console.info(file);
    //            //console.info(data);
  });
  //        上传错误
  uploader.on('error', function(handler) {

    if (handler == "Q_EXCEED_NUM_LIMIT") {
      index.alert("最多只能上传" + options.fileNumLimit + "个!");
    }
    if (handler == "F_DUPLICATE") {
      index.alert("文件重复!");
    }
  });

});
