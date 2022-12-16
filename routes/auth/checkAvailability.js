const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const mysql = require('mysql2');
const config = require('../../config.json');
router.get("/", function (req, res, next) {
    const pool = mysql.createPool({
        host: config.database.hostname,
        user: config.database.username,
        passwordSha1: Buffer.from(config.database.password, 'hex'),
        database: config.database.database,
        waitForConnections: config.database.waitForConnections,
        connectionLimit: config.database.connectionLimit,
        queueLimit: config.database.queueLimit
    });

    pool.query("SELECT deviceid FROM useraccount WHERE username = ? AND password = ? AND isdelete = ? LIMIT 1", [req.query.username, req.query.password, 0],
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                if (results[0]['deviceid']) {
                    res.status(201).send();
                } else {
                    res.status(200).send();
                }
                res.end;
                console.log("Query Status:", chalk.greenBright("(Success) Returns: " + results.length + " data."));
            } else {
                res.status(202).send();
                res.end;
                console.log("Query Status:", chalk.yellowBright("(Failed) Returns empty dataset."));
            };
            pool.end();
        });
});

module.exports = router;