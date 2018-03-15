/**
 * Created by Administrator on 2017/12/16.
 */
function myAjax(opt){
    var opt = opt || {};//默认设置
    opt.type = opt.type || "POST";
    opt.url = opt.url || "";
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function(){};

    var params = [];//处理data数据
    var sendDate = "";//初始化请求数据

    var xhr = null ;
    if(window.XMLHttpRequest){//IE兼容
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    for (key in opt.data){
        params.push(key + "=" + opt.data[key]);
    }
    sendDate = params.join("&");
    if(opt.type.toLowerCase() === "get"){
        xhr.open(opt.type,opt.url + "?" + sendDate,opt.async);
        xhr.send(null);
    }else if(opt.type.toLowerCase() === "post"){
        xhr.open(opt.type,opt.url,opt.async);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.send(sendDate);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var result = null;
            var rhead = xhr.getResponseHeader("Content-Type");
            if(rhead.indexOf("json") !== -1){//分类处理数据
                result = JSON.parse(xhr.response)
            }else if(rhead.indexOf("xml") !== -1 ){
                result = xhr.responseXML;
            }else{
                result = xhr.responseText;
            }
            opt.success && opt.success(result);
        }
    }
}