/**
 * Created by taylor on 15/12/16.
 */
var EventEmitter = require('events').EventEmitter

var life = new EventEmitter()

// addEventListener
life.on('fuck', function(you) {
    console.log('fuck ' + you);
})

life.on('kiss', function(you) {
    console.log('fuck ' + you);
})

life.on('cook', function(you) {
    console.log('fuck ' + you);
})

life.on('play with', function(you) {
    console.log('fuck ' + you);
})
