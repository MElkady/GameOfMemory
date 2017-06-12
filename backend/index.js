const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const gameOfMemory = require("./gameOfMemory.js");

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


app.listen(port, function () {
  console.log('App listening on port ' + port)
})