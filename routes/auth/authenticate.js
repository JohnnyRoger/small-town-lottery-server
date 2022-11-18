const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const mysql = require('mysql2');

router.post("/", function (req, res, next) {
    const pool = mysql.createPool({
        host: "207.148.76.241",
        user: "root",
        passwordSha1: Buffer.from('d6f0ad7752f4a2931bbd0251e64d5bbda8c9ab19', 'hex'),
        database: "stldb",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    pool.query("SELECT userserial_pk FROM useraccount WHERE username = ? AND password = ? AND deviceid = ? AND isdelete = ? LIMIT 1", [req.body.username, req.body.password, req.body.deviceid, 0],
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.status(200).send();
                res.end;
                console.log("Query Status:", chalk.greenBright("(Success) Returns: " + results.length + " data."));
            } else {
                res.status(201).send();
                res.end;
                console.log("Query Status:", chalk.yellowBright("(Success) Returns: " + results.length + " data."));
            };
            pool.end();
        });
});

module.exports = router;