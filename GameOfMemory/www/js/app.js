angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('BACKEND_URL', 'https://game-of-memory.herokuapp.com')

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $compileProvider.debugInfoEnabled(false);

  $stateProvider  
  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html'
  })
  .state('play', {
    url: '/play',
    templateUrl: 'templates/play.html',
    controller: 'PlayCtrl'
  })
  .state('scores', {
    url: '/scores',
    templateUrl: 'templates/scores.html',
    controller: 'ScoresCtrl'
  })
  
  $urlRouterProvider.otherwise('/welcome');
});
