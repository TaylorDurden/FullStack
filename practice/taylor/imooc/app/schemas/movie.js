/**
 * Created by taylor on 26/12/16.
 */
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

MovieSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
});

MovieSchema.statics = {
    fetch: function (callback) {
        return this.find({}).sort('meta.updateAt').exec(callback);
    },
    findById: function (id, callback) {
        return this.findOne({_id: id}).exec(callback);
    }
};

module.exports = MovieSchema;
