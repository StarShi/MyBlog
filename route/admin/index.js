/**
 * Created by Administrator on 2017/11/29.
 */
const express = require("express");
const mysql = require("mysql");

var db = mysql.createPool({host:"localhost",port:"3306",user:"root",password:"root",database:"myblog"});

module.exports= function () {
    var router = express.Router();

    //判断是否登陆
    router.use(function (req,res,next){
        if(!req.session["admin_id"] && req.url !="/login"){//如果没有登录，先进行登录
            res.redirect("/admin/login");
        }else {
            next();
        }
    });
    //访问登录页面
    router.use("/login",require("./login")());
    //登录成功的页面
    router.get("/",function (req,res) {
        res.render("admin/index.ejs",{});
    });
    router.use("/banners/",require("./banners")());
    router.use("/news/",require("./news")());
    router.use("/blogs/",require("./blogs")());
    router.use("/friends/",require("./friends")());
    router.use("/intros/",require("./intros")());
    router.use("/msgs/",require("./msgs")());
    router.use("/aboutme/",require("./aboutme")());
    return router;
};