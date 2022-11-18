const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const api_version = "/api/v1/uri";

//* Router setup
const indexRouter = require('./routes/index');
const updateUserDeviceRouter = require('./routes/auth/updateUserDevice');
const authenticateRouter = require('./routes/auth/authenticate');

const pm2DrawRealtimeRouter = require('./routes/realtime/retrieve2pmDraw');
const pm5DrawRealtimeRouter = require('./routes/realtime/retrieve5pmDraw');
const pm9DrawRealtimeRouter = require('./routes/realtime/retrieve9pmDraw');

const pnlRealtimeRouter = require('./routes/realtime/retrievePNL');

const userUpdateRouter = require('./routes/update/retrieveUser');
const drawUpdateRouter = require('./routes/update/retrieveDraws');

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
app.use(api_version + "/updateUserDevice", updateUserDeviceRouter);
app.use(api_version + "/login", authenticateRouter);

app.use(api_version + "/2pmdraw", pm2DrawRealtimeRouter);
app.use(api_version + "/5pmdraw", pm5DrawRealtimeRouter);
app.use(api_version + "/9pmdraw", pm9DrawRealtimeRouter);

app.use(api_version + "/pnl", pnlRealtimeRouter);

app.use(api_version + "/updateUser", userUpdateRouter);
app.use(api_version + "/updateDraw", drawUpdateRouter);

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
