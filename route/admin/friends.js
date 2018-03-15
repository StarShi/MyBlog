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
                db.query(`SELECT * FROM friend_table WHERE ID='${req.query.id}'`,function (err,updateFriend) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(updateFriend.length == 0){
                            res.status(404).send("friend not found").end();
                        }else{
                            db.query("SELECT * FROM friend_table",function (err,friends) {
                                if(err){
                                    console.error(err);
                                    res.status(500).send("database error").end();
                                }else{
                                    res.render("admin/friends.ejs",{friends,updateFriend:updateFriend[0]});
                                }
                            });
                        }
                    }
                });
                break;
            case  "delete":
                //查询数据是否存在
                db.query(`SELECT * FROM friend_table WHERE ID='${req.query.id}'`,function (err,deleteFriend) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(deleteFriend.length == 0){
                            res.status(404).send("friend not found").end();
                        }else{
                            //逐个删除文件，避免占用内存
                            fs.unlink('./static/upload/'+deleteFriend[0].src,function (err) {
                                if(err){
                                    console.log(err);
                                    res.status(500).send("database err").end();
                                }else {
                                    //删除数据库中的数据
                                    db.query(`DELETE FROM friend_table WHERE ID='${req.query.id}'`,function (err,friends) {
                                        if(err){
                                            console.error(err);
                                            res.status(500).send("database error").end();
                                        }else{
                                            res.redirect("/admin/friends");
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM friend_table`,function (err,friends) {
                    if(err){
                        res.status(500).send("database error").end();
                    }else {
                        res.render("admin/friends.ejs",{friends});
                    }
                });
                break;
        }
    });
    routuer.post("/",function (req,res) {
        var title = req.body.title;
        var description = req.body.description;
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
                db.query(`SELECT * FROM friend_table WHERE ID='${req.body.update_id}'`,function (err,data) {
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
                        db.query(`UPDATE friend_table SET \ 
                            title='${title}',description='${description}',src='${newFileName[0]}'\
                            WHERE ID='${req.body.update_id}'`,function (err,data) {
                            if(err){
                                console.error(err);
                                res.status(500).send("database error").end();
                            }else{
                                res.redirect("/admin/friends");
                            }
                        });
                    }
                });

            }else{//添加
                db.query(`INSERT INTO friend_table (title,description,src) \
                 VALUES ('${title}','${description}','${newFileName[0]}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/friends");
                    }
                });
            }
        }else{
            if(req.body.update_id){//修改
                //直接修改
                db.query(`UPDATE friend_table SET \ 
                title='${title}',description='${description}' \
                WHERE ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/friends");
                    }
                });
            }else{//添加
                db.query(`INSERT INTO friend_table (title,description,src) \
                 VALUES ('${title}','${description}','${newFileName[0]}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else {
                        res.redirect("/admin/friends");
                    }
                });
            }
        }
    });
    return routuer;
};