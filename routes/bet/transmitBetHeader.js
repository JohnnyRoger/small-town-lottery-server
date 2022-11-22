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

    pool.query("DELETE FROM betheader WHERE betheaderserial_pk = ?",
        [req.query.serial],
        function (error, results, fields) {
            if (error) throw error;
            if (results.affectedRows != 0) {
                console.log("Query Status:", chalk.greenBright("(Success) Deleted: " + results.affectedRows + " row."));
            };
            pool.query("INSERT INTO betheader (betheaderserial_pk,agentserial_pk,drawdate,drawserial_pk,transcode,totalamount,encodedby,datecreated,dateprinted,isvoid,editedby,dateedited) values (?,?,?,?,?,?,?,?,?,?,?,?)",
                [req.query.serial,
                req.query.agent,
                req.query.drawdate,
                req.query.drawserial,
                req.query.transcode,
                req.query.totalamount,
                req.query.agent,
                req.query.datecreated,
                req.query.dateprinted,
                req.query.isvoid,
                req.query.editedby,
                req.query.dateedited],
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