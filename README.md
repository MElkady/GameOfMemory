# Game Of Memory
Game Of Memory is a showcase memory game that connects to Flickr API to get some photos for kittens & use it to create a memory game that will be displayed to users using an Ionic mobile client. 

Backend is responsible for:
- Creating the game board based on multiple difficulty levels
- Saving scores
- Retrieving list of high scores

Mobile client is responsible for:
- Display game board & run it
- Display high scores retrieved from backend
- Storing user's settings

Backend is deployed on Heroku free hosting which comes with a limitation that Heroku stops the application's backend if it was idle for sometime. This limitation can be acceptable for a showcase game so before trying to play with the game, try to hit this URL in a browser https://game-of-memory.herokuapp.com/game & wait for it to load before trying the mobile client.

To run the mobile client locally, you need to install Ionic framework by running `npm install -g ionic` then run one of ionic commands: 
- `ionic serve` : to run the application in your browser
- `ionic cordova run android` : to run the application on a connected Android device / emulator
- `ionic cordova emulate ios` : to run the application in iOS simulator
