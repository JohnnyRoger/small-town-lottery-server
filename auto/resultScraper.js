const puppeteer = require('puppeteer')
const schedule = require('node-schedule');
const chalk = require('chalk');
const mysql = require('mysql2');
const crypto = require('crypto');
const dateTime = require('node-datetime');
const config = require('../config.json');

const pool = mysql.createPool({
    host: config.database.hostname,
    user: config.database.username,
    passwordSha1: Buffer.from(config.database.password, 'hex'),
    database: config.database.database,
    waitForConnections: config.database.waitForConnections,
    connectionLimit: config.database.connectionLimit,
    queueLimit: config.database.queueLimit
});

const scrapTrigger2pm = schedule.scheduleJob({ hour: 14, minute: 05 }, () => {
    async function scrape2pm() {
        //* Scrape Result
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        })
        const page = await browser.newPage()
        await page.goto('https://philnews.ph/pcso-lotto-result/swertres-result/')
        var scrap2pm = await page.waitForSelector("#shortcode_swertres11am_id ")
        var result2pm = await page.evaluate(scrap2pm => scrap2pm.textContent, scrap2pm)
        //todo: execute database command
        if (result2pm == "_-_-_") {
            console.log("No result yet.")
        } else {
            //* Save Result
            pool.query("SELECT drawserial_pk FROM draw WHERE drawname = '2 PM'",
                function (error, results, fields) {
                    if (error) throw error;
                    if (results.length > 0) {
                        const dt2 = dateTime.create();
                        const serial = crypto.randomBytes(16).toString("hex");
                        pool.query("INSERT INTO result (resultserial_pk, drawserial_pk, drawdate, winningno, encodedby, datecreated, isdelete) values (?,?,?,?,?,?,?)",
                            [serial,
                                results[0]['drawserial_pk'],
                                dt2.format('Y-m-d'),
                                result2pm.replaceAll("-", ""),
                                "webscraper",
                                dt2.format('Y-m-d H:M:S'),
                                0],
                            function (error, results, fields) {
                                if (error) throw error;
                                if (results.affectedRows != 0) {
                                    console.log("Web Scraper:", chalk.greenBright("(Success) Inserted: " + results.affectedRows + " row."));
                                } else {
                                    console.log("Web Scraper:", chalk.redBright("(Failed) Insertion failed."));
                                };
                            });
                    };
                });
        }
        browser.close()
    }
    scrape2pm()
});

const scrapTrigger5pm = schedule.scheduleJob({ hour: 17, minute: 05 }, () => {
    async function scrape5pm() {
        //* Scrape Result
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        })
        const page = await browser.newPage()
        await page.goto('https://philnews.ph/pcso-lotto-result/swertres-result/')
        var scrap5pm = await page.waitForSelector("#shortcode_swertres4pm_id ")
        var result5pm = await page.evaluate(scrap5pm => scrap5pm.textContent, scrap5pm)
        //todo: execute database command 
        if (result5pm == "_-_-_") {
            console.log("No result yet.")
        } else {
            //* Save Result
            pool.query("SELECT drawserial_pk FROM draw WHERE drawname = '5 PM'",
                function (error, results, fields) {
                    if (error) throw error;
                    if (results.length > 0) {
                        const dt5 = dateTime.create();
                        const serial = crypto.randomBytes(16).toString("hex");
                        pool.query("INSERT INTO result (resultserial_pk, drawserial_pk, drawdate, winningno, encodedby, datecreated, isdelete) values (?,?,?,?,?,?,?)",
                            [serial,
                                results[0]['drawserial_pk'],
                                dt5.format('Y-m-d'),
                                result5pm.replaceAll("-", ""),
                                "webscraper",
                                dt5.format('Y-m-d H:M:S'),
                                0],
                            function (error, results, fields) {
                                if (error) throw error;
                                if (results.affectedRows != 0) {
                                    console.log("Web Scraper:", chalk.greenBright("(Success) Inserted: " + results.affectedRows + " row."));
                                } else {
                                    console.log("Web Scraper:", chalk.redBright("(Failed) Insertion failed."));
                                };
                            });
                    };
                });
        }
        browser.close()
    }
    scrape5pm()
});

const scrapTrigger9pm = schedule.scheduleJob({ hour: 21, minute: 15 }, () => {
    async function scrape9pm() {
        //* Scrape Result
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        })
        const page = await browser.newPage()
        await page.goto('https://philnews.ph/pcso-lotto-result/swertres-result/')
        var scrap9pm = await page.waitForSelector("#shortcode_swertres9pm_id ")
        var result9pm = await page.evaluate(scrap9pm => scrap9pm.textContent, scrap9pm)
        //todo: execute database command 
        if (result9pm == "_-_-_") {
            console.log("No result yet.")
        } else {
            //* Save Result
            pool.query("SELECT drawserial_pk FROM draw WHERE drawname = '9 PM'",
                function (error, results, fields) {
                    if (error) throw error;
                    if (results.length > 0) {
                        const dt9 = dateTime.create();
                        const serial = crypto.randomBytes(16).toString("hex");
                        pool.query("INSERT INTO result (resultserial_pk, drawserial_pk, drawdate, winningno, encodedby, datecreated, isdelete) values (?,?,?,?,?,?,?)",
                            [serial,
                                results[0]['drawserial_pk'],
                                dt9.format('Y-m-d'),
                                result9pm.replaceAll("-", ""),
                                "webscraper",
                                dt9.format('Y-m-d H:M:S'),
                                0],
                            function (error, results, fields) {
                                if (error) throw error;
                                if (results.affectedRows != 0) {
                                    console.log("Web Scraper:", chalk.greenBright("(Success) Inserted: " + results.affectedRows + " row."));
                                } else {
                                    console.log("Web Scraper:", chalk.redBright("(Failed) Insertion failed."));
                                };
                            });
                    };
                });
        }
        browser.close()
    }
    scrape9pm()
});

module.exports = scrapTrigger2pm, scrapTrigger5pm, scrapTrigger9pm;

