'use strict';

const Flickr = require('flickrapi')
const uuidV1 = require('uuid/v1')
const flickrOptions = {
      api_key: '10658f695ffb045e98b55039365ab113',
      secret: '3aee147aa1fd27c9'
    }
const game = require('../models/game.js')
const user = require('../models/user.js')

module.exports.createGame = function(level, callback){
    const noRows = 3
	const noCols = 4
	const time = 120
	const noImages = noRows * noCols / 2

    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
		flickr.photos.search({
			text: 'kitten'
		}, function(err, result) {
			if(err) {
			    callback(err)
			}

			if(result.stat == 'ok') {
				var flickrPhotos = result.photos.photo
				var photos = []
				for(var i = 0; i < flickrPhotos.length && i < noImages; i++) {
					var p = flickrPhotos[i]
					var url = 'https://farm' + p.farm + '.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '.jpg'
					photos.push(url)
					photos.push(url) 	// Yes, I push it twice!
				}
				shuffle(photos)
                
				const game = {
					'id': uuidV1(),
					'photos': photos,
					'noRows': noRows,
					'noCols': noCols,
					'time': time
				}

                callback(null, game)
			} else {
                callback(result)
			}
		})
	})
}

module.exports.saveScore = function(userId, username, gameId, score, callback){
	if(userId) {
		const game = {
			'score': score,
			'gameId': gameId,
			'timestamp': new Date()
		}
		user.findOneAndUpdate({
			'_id': userId
		},
			{
				$push: {'games': game}, 
				$inc: {'totalScore': score}
			},
			{safe: true, upsert: true, new : true},
			function(err, user) {
				callback(err, user)
			}
		)
	} else {
		const g = new game({
			'score': score,
			'gameId': gameId,
			'timestamp': new Date()
		});
		var u = new user({
			'username': username,
    		'totalScore': score,
			'games': [g]
		});
		u.save(function (err, user) {
			callback(err, user)
		})
	}
}

module.exports.getHighScores = function(callback){
	user.find({totalScore: {$exists: true}}, ['_id', 'username', 'totalScore'], {
		limit:10,
		sort: {
			totalScore : -1
		}
	}, callback);
	user.find({totalScore: {$exists: true}}).sort({totalScore : -1}).limit(10);
}

function shuffle(array) {
	for(var i = array.length - 1; i >= 0; i--) {
		const newI = Math.floor(Math.random() * i)
		const value = array[i]
		array[i] = array[newI]
		array[newI] = value
	}
}