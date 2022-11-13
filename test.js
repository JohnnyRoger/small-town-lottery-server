const express = require('express');
const router = express.Router();
const connection = require('./database/config');
const logger = require('node-logs-sqlite');
const logs = new logger();

//* optionnal : configure the logger
logs
    .deleteLogsAfterXDays(2)
    .localStorageDatabase(require("path").join(__dirname, " logs.db"))
    .showInConsole(true);

return logs.init().then(() => {

    return logs.log("this is a message", ["background"]);

}).then(() => {

    return logs.getLogs().then((logs) => {
        return logs.readLog(year, month, day);
    }).then((logs) => {
        console.log(logs); return Promise.resolve();
    });

}).then(() => {

    return logs.release();

}).catch((err) => {
    console.log(err);
});
