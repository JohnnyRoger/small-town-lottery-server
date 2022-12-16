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

    pool.query("SELECT nwnumbers as number FROM lowwin",
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                const result = JSON.stringify(results);
                res.send(result);
                res.end;
                console.log("Query Status:", chalk.greenBright("(Success) Returns: " + results.length + " data."));
            } else {
                res.status(201).send();
                res.end;
                console.log("Query Status:", chalk.yellowBright("(Failed) Returns empty dataset."));
            };
            pool.end();
        });

});

module.exports = router;