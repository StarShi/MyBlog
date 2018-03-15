/**
 * Created by Administrator on 2017/11/27.
 */
const  common = require("./libs/common.js");

var str = "123456";
str = common.md5(str + common.MD5_SUFFIX)
console.log(str);