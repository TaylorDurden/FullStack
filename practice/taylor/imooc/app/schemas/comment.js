/**
 * Created by taylor on 04/01/17.
 */
/**
 * Created by taylor on 26/12/16.
 */
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId; //无业务含义，经过复杂生成

var CommentSchema = new Schema({
    movie: {type: ObjectId, ref: 'Movie'},
    from: {type: ObjectId, ref: 'User'},
    reply: [{
        from: {type: ObjectId, ref: 'User'},
        to: {type: ObjectId, ref: 'User'},
        content: String
    }],
    content: String,
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

CommentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
});

CommentSchema.statics = {
    fetch: function (callback) {
        return this.find({}).sort('meta.updateAt').exec(callback);
    },
    findById: function (id, callback) {
        return this.findOne({_id: id}).exec(callback);
    }
};

module.exports = CommentSchema;
