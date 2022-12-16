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

    pool.query("SELECT under_maintenance FROM command",
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                if (results[0]['under_maintenance'] == 0) {
                    res.status(200).send();
                } else {
                    res.status(201).send();
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