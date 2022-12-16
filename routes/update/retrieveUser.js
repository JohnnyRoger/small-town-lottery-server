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

    pool.query("SELECT t1.userserial_pk AS serial, t1.agentserial_pk as agentSerial, t1.username, t1.password, t1.deviceid AS deviceId, t2.loccode as location" +
        " FROM useraccount t1" +
        " INNER JOIN location t2 ON t1.locserial_pk = t2.locserial_pk" +
        " WHERE t1.username = ? AND t1.isdelete = ? LIMIT 1", [req.query.username, 0],
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