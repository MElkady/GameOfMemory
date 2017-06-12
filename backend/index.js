
const gameOfMemory = require("./controllers/gameOfMemory.js")
const _ = require("underscore")

const mongoose = require('mongoose')
mongoose.connect(process.env.MONOG_URL)

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 8080
app.use(bodyParser.json())

app.get('/game', function (req, res) {
	const level = req.query.q || 1

	gameOfMemory.createGame(level, function(err, game){
		if(err) {
			return res.status(500).set({
					'Access-Control-Allow-Origin': '*'
				}).send(err)
		}

		return res.status(200).set({
						'Access-Control-Allow-Origin': '*'
					}).send(game);
	});
})

app.post('/game', function (req, res) {
	if ((!_.isString(req.body.userId) && !_.isString(req.body.username)) || !_.isString(req.body.gameId) || !_.isNumber(req.body.score)) {
		return res.status(400).set({
						'Access-Control-Allow-Origin': '*'
					}).send({"status": "Bad request"});
	}


	const userId = req.body.userId
	const username = req.body.username
	const gameId = req.body.gameId
	const score = req.body.score

	gameOfMemory.saveScore(userId, username, gameId, score, function(err, user){
		if(err) {
			return res.status(500).set({
					'Access-Control-Allow-Origin': '*'
				}).send(err)
		}

		return res.status(200).set({
						'Access-Control-Allow-Origin': '*'
					}).send({
						"id": user._id,
						"username": user.username,
						"totalScore": user.totalScore
					});
	});
})

app.get('/scores', function (req, res) {
	gameOfMemory.getHighScores(function(err, scores){
		if(err) {
			return res.status(500).set({
					'Access-Control-Allow-Origin': '*'
				}).send(err)
		}

		return res.status(200).set({
						'Access-Control-Allow-Origin': '*'
					}).send(scores);
	})
})



app.listen(port, function () {
  console.log('App listening on port ' + port)
})