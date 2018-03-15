/**
 * Created by Administrator on 2017/11/29.
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
                db.query(`SELECT * FROM banner_table WHERE ID='${req.query.id}'`,function (err,banner) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        if(banner.length == 0){
                            res.status(404).send("banner not found").end();
                        }else{
                            db.query("SELECT * FROM banner_table",function (err,banners) {
                                if(err){
                                    console.error(err);
                                    res.status(500).send("database error").end();
                                }else{
                                    res.render("admin/banners.ejs",{banners,updateBanner:banner[0]});
                                }
                            });
                        }
                    }
                });
                break;
            case  "delete":
                db.query(`DELETE FROM banner_table WHERE ID='${req.query.id}'`,function (err,banners) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/banners");
                    }
                });
                break;
            default:
                db.query("SELECT * FROM banner_table",function (err,banners) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                            res.render("admin/banners.ejs",{banners});
                    }
                });
                break;
        }

    });
    //提交banner数据
    router.post("/",function (req,res) {

        var title = req.body.title;
        var description = req.body.description;
        var href = req.body.href;
        if(!title || !description || !href){
            res.status(400).send("arg  error").end();
        }else {
            if(req.body.update_id){
                db.query(`UPDATE banner_table SET title='${title}',\
                description='${description}',href='${href}' WHERE\
                ID='${req.body.update_id}'`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/banners");
                    }
                })

            }else{
                db.query(`INSERT INTO banner_table (title,description,href)\
             VALUES ("${title}","${description}","${href}")`,function (err,data) {
                    if(err){
                        console.error(err);
                        res.status(500).send("database error").end();
                    }else{
                        res.redirect("/admin/banners");
                    }
                });
            }

        }
    });
    return router;
};