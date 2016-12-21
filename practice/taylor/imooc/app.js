/**
 * Created by taylor on 20/12/16.
 */
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.set('views', './views/pages');
app.set('view engine', 'jade');
var serveStatic = require('serve-static')
app.use(serveStatic('bower_components'))
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
app.listen(port);

console.log('imooc started on port ' + port);


//index page
app.get('/', function(req, res) {
    res.render('index', {
        title: 'imooc 首页',
        movies: [{
            title: '机械战警',
            _id: 1,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 2,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 3,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 4,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        }]
    });
});

//detail page
app.get('/movie/:id', function(req, res) {
    res.render('detail', {
        title: 'imooc 详情页',
        movies: [{
            title: '机械战警',
            _id: 1,
            director: '阿西吧',
            country: '美国',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: '拍摄于1987年。。'
        }]
    });
});

//admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

//list page
app.get('/admin/list', function(req, res) {
    res.render('list', {
        title: 'imooc 列表页',
        movies: [{
            title: '机械战警',
            _id: 1,
            director: '阿西吧',
            country: '美国',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: '拍摄于1987年。。'
        }]
    });
});