/**
 * Created by taylor on 09/01/17.
 */
var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');
var Category = mongoose.model('Category', CategorySchema);

module.exports = Category