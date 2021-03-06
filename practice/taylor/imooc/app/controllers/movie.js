/**
 * Created by taylor on 02/01/17.
 */
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');

//detail page
exports.detail = function(req, res) {
    var id = req.params.id
    Movie.findById(id, function (err, movie){
        Comment
            .find({movie: id})
            .populate('from', 'name')
            .populate('reply.from', 'name')
            .exec(function(err, comments) {
                console.log('comments: ');
                console.log(comments);
                res.render('detail', {
                    title: 'imooc '+ movie.title,
                    movie: movie,
                    comments: comments
                });
            });
    });
};

//admin page
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: 'imooc 后台录入页',
            movie: {},
            categories: categories
        });
    });
};

//admin update movie from list
exports.update = function(req, res) {
    var id = req.params.id

    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: 'imooc 后台更新页',
                    movie: movie,
                    categories: categories
                });
            });
        });
    }
};

//admin post movie
exports.save = function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err){
                console.log(err)
            }

            //movie查询的， movieObj是post的
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err){
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        _movie = new Movie(movieObj);

        var categoryId = _movie.category;
        var categoryName = movieObj.categoryName;

        console.log(movieObj);
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            if(categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.movies.push(movie._id);

                    category.save(function(err, category) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            } else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });

                category.save(function(err, category) {
                    movie.category = category._id;
                    movie.save(function(err, movie) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            }
        });
    }
};

//list page
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err)
        }

        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        });
    });
};

// delete movie from list
exports.delete = function(req, res) {
    var id = req.query.id;

    if (id) {
        Movie.remove({_id: id}, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
};