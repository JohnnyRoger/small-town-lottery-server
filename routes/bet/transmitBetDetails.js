const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const mysql = require('mysql2');
const config = require('../../config.json');
router.post("/", function (req, res, next) {
    const pool = mysql.createPool({
        host: config.database.hostname,
        user: config.database.username,
        passwordSha1: Buffer.from(config.database.password, 'hex'),
        database: config.database.database,
        waitForConnections: config.database.waitForConnections,
        connectionLimit: config.database.connectionLimit,
        queueLimit: config.database.queueLimit
    });

    pool.query("DELETE FROM betdetails WHERE betheaderserial_pk = ? AND betdetailsserial_pk= ?",
        [req.query.headerserial, req.query.serial],
        function (error, results, fields) {
            if (error) throw error;
            if (results.affectedRows != 0) {
                console.log("Query Status:", chalk.greenBright("(Success) Deleted: " + results.affectedRows + " row."));
            };
            pool.query("INSERT INTO betdetails (betdetailsserial_pk,betheaderserial_pk,drawtype,betno,amount,win,isrambolito) values (?,?,?,?,?,?,?)",
                [req.query.serial,
                req.query.headerserial,
                    "S3",
                req.query.betno,
                req.query.totalamount,
                req.query.win,
                req.query.isrambolito],
                function (error, results, fields) {
                    if (error) throw error;
                    if (results.affectedRows != 0) {
                        res.status(200).send();
                        res.end;
                        console.log("Query Status:", chalk.greenBright("(Success) Inserted: " + results.affectedRows + " row."));
                    } else {
                        res.status(201).send();
                        res.end;
                        console.log("Query Status:", chalk.redBright("(Failed) Insertion failed."));
                    };
                    pool.end();
                });
        });
});

module.exports = router;