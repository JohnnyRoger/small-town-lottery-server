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

    pool.query("SELECT t1.drawdate 'DATE', t4.agentcode 'AGENT', t5.loccode 'LOCATION', t3.drawname 'DRAW TIME', COALESCE(t6.winningno,'TBA') 'result', " +
        " (SELECT SUM(e1.amount) FROM betdetails e1 INNER JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk " +
        " WHERE f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk) 'TOTAL BET'," +
        " COALESCE((SELECT SUM(e1.win) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk" +
        " WHERE e1.isrambolito = 0 AND e1.betno = t6.winningno AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk GROUP BY f1.transcode), 0.00)" +
        " +" +
        " COALESCE((SELECT SUM(e1.win) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk" +
        " WHERE e1.isrambolito = 1 AND e1.betno LIKE CONCAT('%', LEFT(t6.winningno, 1), '%') AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk" +
        " AND e1.betno LIKE CONCAT('%', MID(t6.winningno, 2, 1), '%') AND e1.betno LIKE CONCAT('%', RIGHT(t6.winningno, 1), '%') " +
        " GROUP BY f1.transcode), 0.00)" +
        " +" +
        " (SELECT if (t2.betno <> t6.winningno AND t2.betno <> t6.winningno AND t2.betno NOT LIKE CONCAT('%', LEFT(t6.winningno, 1), '%') AND t2.betno NOT LIKE CONCAT('%', MID(t6.winningno, 2, 1), '%') AND t2.betno NOT LIKE CONCAT('%', RIGHT(t6.winningno, 1), '%'), COALESCE((" +
        " SELECT SUM(e1.win) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk WHERE e1.isrambolito = 2 AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk AND" +
        " t2.betno <> t6.winningno AND e1.betno NOT LIKE CONCAT('%', LEFT(t6.winningno, 1), '%') AND t2.betno NOT LIKE CONCAT('%', MID(t6.winningno, 2, 1), '%') AND t2.betno NOT LIKE CONCAT('%', RIGHT(t6.winningno, 1), '%') " +
        " GROUP BY f1.transcode), 0.00), 0)) 'totalHit'," +
        " (SELECT SUM(e1.amount) FROM betdetails e1 INNER JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk " +
        " WHERE f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk)" +
        " -" +
        " (COALESCE((SELECT SUM(e1.win) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk" +
        " WHERE e1.isrambolito = 0 AND e1.betno = t6.winningno AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk GROUP BY f1.transcode), 0.00)" +
        " +" +
        " COALESCE((SELECT SUM(e1.win) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk" +
        " WHERE e1.isrambolito = 1 AND e1.betno LIKE CONCAT('%', LEFT(t6.winningno, 1), '%') AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk" +
        " AND e1.betno LIKE CONCAT('%', MID(t6.winningno, 2, 1), '%') AND e1.betno LIKE CONCAT('%', RIGHT(t6.winningno, 1), '%') " +
        " GROUP BY f1.transcode), 0.00)" +
        " +" +
        " (SELECT if (t2.betno <> t6.winningno AND t2.betno <> t6.winningno AND t2.betno NOT LIKE CONCAT('%', LEFT(t6.winningno, 1), '%') AND t2.betno NOT LIKE CONCAT('%', MID(t6.winningno, 2, 1), '%') AND t2.betno NOT LIKE CONCAT('%', RIGHT(t6.winningno, 1), '%'), COALESCE((" +
        "     SELECT SUM(e1.win) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk WHERE e1.isrambolito = 2 AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk AND" +
        " t2.betno <> t6.winningno AND e1.betno NOT LIKE CONCAT('%', LEFT(t6.winningno, 1), '%') AND t2.betno NOT LIKE CONCAT('%', MID(t6.winningno, 2, 1), '%') AND t2.betno NOT LIKE CONCAT('%', RIGHT(t6.winningno, 1), '%') " +
        " GROUP BY f1.transcode), 0.00), 0))) 'pnl', " +
        " COALESCE((SELECT COUNT(e1.betdetailsserial_pk) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk " +
        "WHERE e1.isrambolito = 0 AND e1.betno = t6.winningno AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk " +
        "GROUP BY f1.transcode),0.00)" +
        " +" +
        " COALESCE((SELECT COUNT(e1.betdetailsserial_pk) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk" +
        " WHERE e1.isrambolito = 1 AND e1.betno LIKE CONCAT('%',LEFT(t6.winningno,1),'%') AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk" +
        " AND e1.betno LIKE CONCAT('%',MID(t6.winningno,2,1),'%') AND e1.betno LIKE CONCAT('%',RIGHT(t6.winningno,1),'%') " +
        " GROUP BY f1.transcode),0.00)" +
        " +" +
        " (SELECT if(t2.betno <> t6.winningno AND t2.betno <> t6.winningno AND t2.betno NOT LIKE CONCAT('%',LEFT(t6.winningno,1),'%') AND t2.betno NOT LIKE CONCAT('%',MID(t6.winningno,2,1),'%') AND t2.betno NOT LIKE CONCAT('%',RIGHT(t6.winningno,1),'%') , COALESCE((" +
        " SELECT COUNT(e1.betdetailsserial_pk) FROM betdetails e1 LEFT JOIN betheader f1 ON e1.betheaderserial_pk = f1.betheaderserial_pk WHERE e1.isrambolito = 2 AND f1.drawdate = t1.drawdate AND f1.drawserial_pk = t1.drawserial_pk AND f1.agentserial_pk = t1.agentserial_pk AND" +
        " t2.betno <> t6.winningno AND e1.betno NOT LIKE CONCAT('%',LEFT(t6.winningno,1),'%') AND t2.betno NOT LIKE CONCAT('%',MID(t6.winningno,2,1),'%') AND t2.betno NOT LIKE CONCAT('%',RIGHT(t6.winningno,1),'%') " +
        " GROUP BY f1.transcode),0.00),0)) 'win' " +
        " FROM betheader t1" +
        " INNER JOIN agent t4 ON t1.agentserial_pk = t4.agentserial_pk" +
        " INNER JOIN location t5 ON t4.locserial_pk = t5.locserial_pk" +
        " INNER JOIN draw t3 ON t1.drawserial_pk = t3.drawserial_pk" +
        " INNER JOIN result t6 ON t1.drawserial_pk = t6.drawserial_pk" +
        " INNER JOIN betdetails t2 ON t1.betheaderserial_pk = t2.betheaderserial_pk" +
        " WHERE t1.drawdate = ? AND t1.agentserial_pk = ? AND t1.drawserial_pk = ?" +
        " GROUP BY t1.drawdate",
        [req.query.date, req.query.agent, req.query.draw],
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