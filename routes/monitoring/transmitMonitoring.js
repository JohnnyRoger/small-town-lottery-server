const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const mysql = require('mysql2');

//* Get home page
router.post("/", function (req, res, next) {
    const pool = mysql.createPool({
        host: "207.148.76.241",
        user: "root",
        passwordSha1: Buffer.from('d6f0ad7752f4a2931bbd0251e64d5bbda8c9ab19', 'hex'),
        database: "arhrms",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    pool.query("INSERT INTO monitoring (monserial,mondate,weekno,farmserial,workerserial,modserial,opserial,monstatus,montypeserial,justification,datecreated,encodedby,isdelete) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [req.query.serial, req.query.date, req.query.week, req.query.farm, req.query.worker, req.query.module, req.query.operation, req.query.status, req.query.statustype, req.query.justification, req.query.datecreated, req.query.encodedby, 0],
        function (error, results, fields) {
            if (error) throw error;
            if (results.affectedRows != 0) {
                res.status(200).send();
                res.end;
                console.log("Query Status:", chalk.greenBright("(Success) Affected: " + results.affectedRows + " row."));
            } else {
                res.status(201).send();
                res.end;
                console.log("Query Status:", chalk.redBright("(Error) Returns: " + results.affectedRows + " data."));
            };
            pool.end();
        });
});

module.exports = router;