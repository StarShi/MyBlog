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
                db.query(`SELECT * FROM aboutme_table WHERE ID='${req.query.id}'`,function (err,updateMe) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(updateMe.length == 0){
                            res.status(404).send("me not found").end();
                        }else{
                            db.query("SELECT * FROM aboutme_table",function (err,aboutme) {
                                if(err){
                                    console.error(err);
                                    res.status(500).send("database error").end();
                                }else{
                                    res.render("admin/aboutme.ejs",{aboutme,updateMe:updateMe[0]});
                                }
                            });
                        }
                    }
                });
                break;
            case  "delete":
                //查询数据是否存在
                db.query(`SELECT * FROM aboutme_table WHERE ID='${req.query.id}'`,function (err,deleteMe) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(deleteMe.length == 0){
                            res.status(404).send("me not found").end();
                        }else{
                            //逐个删除文件，避免占用内存
                            fs.unlink('./static/upload/'+deleteMe[0].pic_src,function (err) {
                                if(err){
                                    console.log(err);
                                    res.status(500).send("database err").end();
                                }else {
                                    fs.unlink('./static/upload/'+deleteMe[0].wei_src,function (err) {
                                        if(err){
                                            console.log(err);
                                            res.status(500).send("database err").end();
                                        }else {//删除数据库中的数据
                                            db.query(`DELETE FROM aboutme_table WHERE ID='${req.query.id}'`,function (err,aboutme) {
                                                if(err){
                                                    console.error(err);
                                                    res.status(500).send("database error").end();
                                                }else{
                                                    res.redirect("/admin/aboutme");
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM aboutme_table`,function (err,aboutme) {
                    if(err){
                        res.status(500).send("database error").end();
                    }else {
                        res.render("admin/aboutme.ejs",{aboutme});
                    }
                });
                break;
        }
    });
    routuer.post("/",function (req,res) {
        var title = req.body.title;
        var content = req.body.content;
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
        if(newFileName.length == 2){//判断有没有文件
            for(var i=0;i<newFileName.length;i++ ){
                fs.rename(oldPath[i],newPath[i],function (err) {//文件重命名
                    (err)&&res.status(500).send("file opration error").end();
                });
            }
            if(req.body.update_id){//修改
                db.query(`SELECT * FROM aboutme_table WHERE ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else if(data.length == 0){
                        res.status(404).send("old file not found").end();
                    }else{
                        //删除旧的文件
                        fs.unlink('static/upload/'+ data[0].pic_src,function (err) {
                            (err)&&res.status(500).send("file opration error").end()
                        });
                        fs.unlink('static/upload/'+ data[0].wei_src,function (err) {
                            (err)&&res.status(500).send("file opration error").end()
                        });
                        //修改
                        db.query(`UPDATE aboutme_table SET \ 
                            title='${title}',content='${content}',href='${href}', \
                            pic_src='${newFileName[0]}',wei_src='${newFileName[1]}' \
                            WHERE ID='${req.body.update_id}'`,function (err,data) {
                            if(err){
                                console.error(err);
                                res.status(500).send("database error").end();
                            }else{
                                res.redirect("/admin/aboutme");
                            }
                        });
                    }
                });

            }else{//添加
                db.query(`INSERT INTO aboutme_table \
                 (title,content,href,pic_src,wei_src)
                 VALUES ('${title}','${content}','${href}','${newFileName[0]}',\
                 '${newFileName[1]}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/aboutme");
                    }
                });

            }
        }else{
            if(req.body.update_id){//修改
                //直接修改
                db.query(`UPDATE aboutme_table SET \ 
               title='${title}',content='${content}',href='${href}' \
                WHERE ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/aboutme");
                    }
                });
            }else{//添加
                db.query(`INSERT INTO aboutme_table \
                 (title,content,href,pic_src,wei_src)
                 VALUES ('${title}','${content}','${href}','${newFileName[0]}',\
                 '${newFileName[1]}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/aboutme");
                    }
                });

            }
        }
    });
    return routuer;
};