/**
 * Created by taylor on 26/12/16.
 */
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie