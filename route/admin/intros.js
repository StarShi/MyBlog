/**
 * Created by Administrator on 2017/12/5.
 */
const express= require("express");
const mysql = require("mysql");
const pathLib = require("path");
const fs = require("fs");
var db = mysql.createPool({host:"localhost",port:"3306",user:"root",password:"root",database:"myblog"});

module.exports = function () {
    var routuer = express.Router();
    routuer.get("/",function (req,res) {
        switch (req.query.act){
            case  "update":
                db.query(`SELECT * FROM intro_table WHERE ID='${req.query.id}'`,function (err,updateIntro) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(updateIntro.length == 0){
                            res.status(404).send("intros not found").end();
                        }else{
                            db.query("SELECT * FROM intro_table",function (err,intros) {
                                if(err){
                                    console.error(err);
                                    res.status(500).send("database error").end();
                                }else{
                                    res.render("admin/intros.ejs",{intros,updateIntro:updateIntro[0]});
                                }
                            });
                        }
                    }
                });
                break;
            case  "delete":
                //查询数据是否存在
                db.query(`SELECT * FROM intro_table WHERE ID='${req.query.id}'`,function (err,deleteIntro) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(deleteIntro.length == 0){
                            res.status(404).send("friend not found").end();
                        }else{
                            //逐个删除文件，避免占用内存
                            fs.unlink('./static/upload/'+deleteIntro[0].src,function (err) {
                                if(err){
                                    console.log(err);
                                    res.status(500).send("database err").end();
                                }else {
                                    //删除数据库中的数据
                                    db.query(`DELETE FROM intro_table WHERE ID='${req.query.id}'`,function (err,intros) {
                                        if(err){
                                            console.error(err);
                                            res.status(500).send("database error").end();
                                        }else{
                                            res.redirect("/admin/intros");
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM intro_table`,function (err,intros) {
                    if(err){
                        res.status(500).send("database error").end();
                    }else {
                        res.render("admin/intros.ejs",{intros});
                    }
                });
                break;
        }
    });
    routuer.post("/",function (req,res) {
        var title = req.body.title;
        var description = req.body.description;
        var href = req.body.href;
        var oldPath = [];
        var newPath = [];
        var newFileName= [];
        if(req.files){
            for(var i=0,len=req.files.length;i<len;i++){
                var ext = pathLib.parse(req.files[i].originalname).ext;
                oldPath.push(req.files[i].path);
                newPath.push(req.files[i].path + ext);
                newFileName.push(req.files[i].filename + ext);
            }
        }else{
            newFileName = [];
        }
        if(newFileName.length == 1){//判断有没有传来一个文件
            for(var i=0;i<newFileName.length;i++ ){
                fs.rename(oldPath[i],newPath[i],function (err) {//文件重命名
                    (err)&&res.status(500).send("file opration error").end();
                });
            }
            if(req.body.update_id){//修改
                db.query(`SELECT * FROM intro_table WHERE ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else if(data.length == 0){
                        res.status(404).send("old file not found").end();
                    }else{
                        //删除旧的文件
                        fs.unlink('static/upload/'+ data[0].src,function (err) {
                            (err)&&res.status(500).send("file opration error").end()
                        });
                        //修改
                        db.query(`UPDATE intro_table SET \ 
                            title='${title}',description='${description}',src='${newFileName[0]}'\
                            WHERE ID='${req.body.update_id}'`,function (err,data) {
                            if(err){
                                console.error(err);
                                res.status(500).send("database error").end();
                            }else{
                                res.redirect("/admin/intros");
                            }
                        });
                    }
                });

            }else{//添加
                db.query(`INSERT INTO intro_table (title,description,href,src) \
                 VALUES ('${title}','${description}','${href}','${newFileName[0]}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/intros");
                    }
                });
            }
        }else{
            if(req.body.update_id){//修改
                //直接修改
                db.query(`UPDATE intro_table SET \ 
                title='${title}',description='${description}',href='${href}'\
                WHERE ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/intros");
                    }
                });
            }else{//添加
                db.query(`INSERT INTO intro_table (title,description,href,src) \
                 VALUES ('${title}','${description}','${href},'${newFileName[0]}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/intros");
                    }
                });
            }
        }
    });
    return routuer;
};