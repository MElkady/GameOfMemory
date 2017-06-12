var mongoose = require('mongoose')
var game = require('./game.js')

var userSchema = mongoose.Schema({
    username: String,
    totalScore: Number,
    games: [game.schema]
})

module.exports = mongoose.model('User', userSchema)