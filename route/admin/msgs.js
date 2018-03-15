/**
 * Created by Administrator on 2017/12/5.
 */
const express = require("express");
const  common = require("../../libs/common");
const mysql = require("mysql");

var db = mysql.createPool({host:"localhost",port:"3306",user:"root",password:"root",database:"myblog"});

module.exports = function () {
    var router = express.Router();

    //访问banner数据
    router.get("/",function(req,res) {
        switch (req.query.act){
            case  "update":
                db.query(`SELECT * FROM msg_table WHERE ID='${req.query.id}'`,function (err,updateMsg) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(updateMsg.length == 0){
                            res.status(404).send("banner not found").end();
                        }else{
                            db.query("SELECT * FROM msg_table",function (err,msgs) {
                                if(err){
                                    console.error(err);
                                    res.status(500).send("database error").end();
                                }else{
                                    res.render("admin/msgs.ejs",{msgs,updateMsg:updateMsg[0]});
                                }
                            });
                        }
                    }
                });
                break;
            case  "delete":
                db.query(`DELETE FROM msg_table WHERE ID='${req.query.id}'`,function (err,msgs) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/msgs");
                    }
                });
                break;
            default:
                db.query("SELECT * FROM msg_table",function (err,msgs) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.render("admin/msgs.ejs",{msgs});
                    }
                });
                break;
        }

    });
    //提交banner数据
    router.post("/",function (req,res) {

        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var subject = req.body.subject;
        if(!name || !email || !phone || !subject){
            res.status(400).send("arg  error").end();
        }else {
            if(req.body.update_id){
                db.query(`UPDATE msg_table SET name='${name}',\
                email='${email}',phone='${phone}',subject='${subject}' WHERE\
                ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/msgs");
                    }
                })

            }else{
                db.query(`INSERT INTO msg_table (name,email,phone,subject)\
             VALUES ('${name}','${email}','${phone}','${subject}')`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/msgs");
                    }
                });
            }

        }
    });
    return router;
};