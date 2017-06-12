var mongoose = require('mongoose')
var gameSchema = mongoose.Schema({
	score: Number,
	gameId: String,
    timestamp: Date
})

module.exports = mongoose.model('Game', gameSchema)