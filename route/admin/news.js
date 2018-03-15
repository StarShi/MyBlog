/**
 * Created by Administrator on 2017/12/4.
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
                db.query(`SELECT * FROM news_table WHERE ID='${req.query.id}'`,function (err,updateNews) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(updateNews.length == 0){
                            res.status(404).send("news not found").end();
                        }else{
                            db.query("SELECT * FROM news_table",function (err,news) {
                                if(err){
                                    console.error(err);
                                    res.status(500).send("database error").end();
                                }else{
                                    res.render("admin/news.ejs",{news,updateNews:updateNews[0]});
                                }
                            });
                        }
                    }
                });
                break;
            case  "delete":
                //查询数据是否存在
                db.query(`SELECT * FROM news_table WHERE ID='${req.query.id}'`,function (err,deleteNews) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(deleteNews.length == 0){
                            res.status(404).send("news not found").end();
                        }else{
                            //逐个删除文件，避免占用内存
                            fs.unlink('./static/upload/'+deleteNews[0].icon_src,function (err) {
                                if(err){
                                    console.log(err);
                                    res.status(500).send("database err").end();
                                }else {
                                    fs.unlink('./static/upload/'+deleteNews[0].big_pic_src,function (err) {
                                        if(err){
                                            console.log(err);
                                            res.status(500).send("database err").end();
                                        }else {//删除数据库中的数据
                                            db.query(`DELETE FROM news_table WHERE ID='${req.query.id}'`,function (err,news) {
                                                if(err){
                                                    console.error(err);
                                                    res.status(500).send("database error").end();
                                                }else{
                                                    res.redirect("/admin/news");
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
                db.query(`SELECT * FROM news_table`,function (err,news) {
                    if(err){
                        res.status(500).send("database error").end();
                    }else {
                        res.render("admin/news.ejs",{news});
                    }
                });
                break;
        }
    });
    routuer.post("/",function (req,res) {
        var title = req.body.title;
        var summary = req.body.summary;
        var content = req.body.content;
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
                db.query(`SELECT * FROM news_table WHERE ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else if(data.length == 0){
                        res.status(404).send("old file not found").end();
                    }else{
                        //删除旧的文件
                        fs.unlink('static/upload/'+ data[0].icon_src,function (err) {
                            (err)&&res.status(500).send("file opration error").end()
                        });
                        fs.unlink('static/upload/'+ data[0].big_pic_src,function (err) {
                            (err)&&res.status(500).send("file opration error").end()
                        });
                        //修改
                        db.query(`UPDATE news_table SET \ 
                            title='${title}',summary='${summary}',content='${content}', \
                            icon_src='${newFileName[0]}',big_pic_src='${newFileName[1]}' \
                            WHERE ID='${req.body.update_id}'`,function (err,data) {
                            if(err){
                                console.error(err);
                                res.status(500).send("database error").end();
                            }else{
                                res.redirect("/admin/news");
                            }
                        });
                    }
                });

            }else{//添加
                db.query(`INSERT INTO news_table \
                 (title,summary,icon_src,big_pic_src,content)
                 VALUES ('${title}','${summary}','${newFileName[0]}',\
                 '${newFileName[1]}','${content}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/news");
                    }
                });

            }
        }else{
            if(req.body.update_id){//修改
                //直接修改
                db.query(`UPDATE news_table SET \ 
                title='${title}',summary='${summary}',content='${content}' \
                WHERE ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/news");
                    }
                });
            }else{//添加
                db.query(`INSERT INTO news_table \
                 (title,summary,icon_src,big_pic_src,content)
                 VALUES ('${title}','${summary}','${newFileName[0]}',\
                 '${newFileName[1]}','${content}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/news");
                    }
                });

            }
        }
    });
    return routuer;
};