/**
 * Created by taylor on 20/12/16.
 */
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');

var port = process.env.PORT || 3000;
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
}));

// 配置入口文件
if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

app.locals.moment = require('moment');
require('./config/routes')(app);
app.listen(port);
mongoose.Promise = global.Promise;

console.log('imooc started on port ' + port);
