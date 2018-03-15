/**
 * Created by Administrator on 2017/11/27.
 */
const express = require("express");
const mysql = require("mysql");

var db = mysql.createPool({host:"localhost",port:"3306",user:"root",password:"root",database:"myblog"});

module.exports= function () {
    var router = express.Router();
    router.get("/get_banners",function (req,res) {
        db.query("SELECT * FROM banner_table ",function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_friends",function (req,res) {
        db.query("SELECT * FROM friend_table ",function (err,data) {
            if(err){
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_aboutme",function (req,res) {
        db.query("SELECT * FROM aboutme_table ",function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_news",function (req,res) {
        var start = req.query.start;
        var count = req.query.count;
        db.query(`SELECT * FROM news_table LIMIT ${start},${count} `,function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_blogs",function (req,res) {
        var start = req.query.start;
        var count = req.query.count;
        db.query(`SELECT * FROM blog_table LIMIT ${start},${count} `,function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_intros",function (req,res) {
        var start = req.query.start;
        var count = req.query.count;
        db.query(`SELECT * FROM intro_table LIMIT ${start},${count} `,function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_newsDetail",function (req,res) {
        var id = req.query.id;
        db.query(`SELECT * FROM news_table WHERE ID = ${id}`,function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_newsCount",function (req,res) {
        db.query("SELECT COUNT(*) AS 'count' FROM news_table",function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_moreNews",function (req,res) {
        var start = req.query.start;
        var count = req.query.count;
        db.query(`SELECT *  FROM news_table LIMIT ${start},${count}`,function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_blogDetail",function (req,res) {
        var id = req.query.id;
        console.log(id)
        db.query(`SELECT * FROM blog_table WHERE ID = ${id}`,function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_blogsCount",function (req,res) {
        db.query("SELECT COUNT(*) AS 'count' FROM blog_table",function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get("/get_moreBlogs",function (req,res) {
        var start = req.query.start;
        var count = req.query.count;
        db.query(`SELECT *  FROM blog_table LIMIT ${start},${count}`,function (err,data) {
            if(err){
                console.error(err);
                res.status(500).send("database error").end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.post("/post_msg",function (req,res) {
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var subject = req.body.subject;
        console.log(name,subject)
        if(!name || !email || !phone || !subject){
            res.status(400).send("message  error").end();
        }else {
                db.query(`INSERT INTO msg_table (name,email,phone,subject)\
             VALUES ('${name}','${email}','${phone}','${subject}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        var resMsg = {"Msg": "ok"};
                        res.send(resMsg).end();
                    }
                });
            }
    });
    return router;
};