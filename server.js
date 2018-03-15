/**
 * Created by shixin on 2017/11/27.
 */
const express = require("express");
const expressStatic = require("express-static");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const multerObj = multer({dest: "./static/upload"});
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const consolidate = require("consolidate");
const expressRoute = require("express-route");
var server = express();
server.listen(8080);

//1、获取前台请求数据
//get自带
server.use(bodyParser.urlencoded());
server.use(multerObj.any());
//2、cookie  session
server.use(cookieParser());
(function () {
    var keys =[];
    for(var i=0;i<1000000;i++){
        keys[i]="keys_" + Math.random();
    }
    server.use(cookieSession({
        name: "session_id",
        keys: keys,
        maxAge: 20*60*1000 //20分钟
    }));
})();
//3、模版
server.engine("html",consolidate.ejs);
server.set("view engine" ,"html");
server.set("views","template");

//4、route
server.use("/admin",require("./route/admin/index.js")());
server.use("/",require("./route/web/index.js")());
//5、default static
server.use(expressStatic("./static/"));

