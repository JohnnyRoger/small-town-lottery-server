const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const api_version = "/api/v1/uri";

//* 
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/update/retrieveusers');
const workersRouter = require('./routes/update/retrieveworkers');
const modulesRouter = require('./routes/update/retrievemodule');
const operationsRouter = require('./routes/update/retrieveoperations');
const weeksRouter = require('./routes/update/retrieveweeks');
const statusRouter = require('./routes/update/retrievestatus');
const monitoringRouter = require('./routes/monitoring/transmitMonitoring');
const app = express();

//* view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(api_version + "/", indexRouter);
app.use(api_version + "/users", usersRouter);
app.use(api_version + "/workers", workersRouter);
app.use(api_version + "/modules", modulesRouter);
app.use(api_version + "/operations", operationsRouter);
app.use(api_version + "/weeks", weeksRouter);
app.use(api_version + "/status", statusRouter);
app.use(api_version + "/monitoring", monitoringRouter);

//* catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//* error handler
app.use(function (err, req, res, next) {
  //! set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //* render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err);
});

module.exports = app;
