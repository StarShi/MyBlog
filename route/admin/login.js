/**
 * Created by Administrator on 2017/11/27.
 */
const express = require("express");
const  common = require("../../libs/common");
const mysql = require("mysql");

var db = mysql.createPool({host:"localhost",port:"3306",user:"root",password:"root",database:"myblog"});

module.exports= function() {
    var router = express.Router();

    //访问登录页面
    router.get("/",function (req,res) {
        res.render("admin/login.ejs",{});
    });
    //提交登录数据
    router.post("/",function (req,res) {
        var name = req.body.username;
        var psd = common.md5(req.body.password + common.MD5_SUFFIX);

        db.query(`SELECT * FROM user_table WHERE username='${name}'`,function (err,data){
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else{
                if(data.length == 0){
                    res.status(400).send("no this admin").end();
                }else{
                    if(data[0].password == psd){
                        //成功
                        req.session["admin_id"] = data[0].ID;
                        res.redirect("/admin/");
                    }else {
                        res.status(400).send("this password is incorrect").end();
                    }
                }
            }
        });
    });

    return router;
};