const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const mysql = require('mysql2');
const config = require('../../config.json');
router.patch("/", function (req, res, next) {
    const pool = mysql.createPool({
        host: config.database.hostname,
        user: config.database.username,
        passwordSha1: Buffer.from(config.database.password, 'hex'),
        database: config.database.database,
        waitForConnections: config.database.waitForConnections,
        connectionLimit: config.database.connectionLimit,
        queueLimit: config.database.queueLimit
    });

    pool.query("UPDATE betheader SET isvoid = ? WHERE betheaderserial_pk = ?",
        [req.query.isvoid, req.query.headerserial],
        function (error, results) {
            if (error) throw error;
            if (results.affectedRows != 0) {
                res.status(200).send();
                res.end;
                console.log("Query Status:", chalk.greenBright("(Success) Updated: " + results.affectedRows + " row."));
            } else {
                res.status(201).send();
                res.end;
                console.log("Query Status:", chalk.redBright("(Failed) Update failure."));
            };
            pool.end();
        });
});

module.exports = router;