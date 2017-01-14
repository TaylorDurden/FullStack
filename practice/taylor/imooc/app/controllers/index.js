/**
 * Created by taylor on 02/01/17.
 */
var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req, res) {
    console.log('user in session: ');
    console.log(req.session.user);

    Category
        .find({})
        .populate({
            path: 'movies',
            options: { limit: 6 }
        })
        .exec(function(err, categories) {
            if (err) console.log(err);

            res.render('index', {
                title: 'imooc 首页',
                categories: categories
            });
        });
};

// search page
exports.search = function(req, res) {
    var categoryId = req.query.categoryId;
    var page = parseInt(req.query.p, 10) || 0;
    var q = req.query.q;
    var count = 2;
    var index = page * count;

    if (categoryId){
        Category
            .find({ _id: categoryId })
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec(function(err, categories) {
                if (err) console.log(err);

                var category = categories[0] || {};
                var movies = category.movies || [];
                var results = movies.slice(index, index+count);

                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: category.name,
                    currentPage: (page + 1),
                    query: 'category='+categoryId,
                    totalPage: Math.ceil(movies.length / count),
                    results: results
                });
            });
    }
    else {
        Movie
            .find({title: new RegExp(q+ '.*', 'i')})
            .exec(function(err, movies) {
                if (err) console.log(err);

                var results = movies.slice(index, index+count);

                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: q,
                    currentPage: (page + 1),
                    query: 'q='+q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            })
    }
};