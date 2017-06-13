angular.module('starter.controllers', [])

.controller('PlayCtrl', function($http, $timeout, $scope, $interval, $ionicPopup, $ionicLoading, BACKEND_URL) {
  // Game data
  this.photosGrid = [];
  this.noPhotos = 0;
  this.time = 0;
  this.gameId = null;

  // Intermediate variables
  this.flipedPhoto = null;
  this.disableFlipping = false;
  this.timer = null;

  // Game outputs
  this.noMatches = 0;
  this.score = 0;
  const ctrl = this;


  $scope.$on('$ionicView.enter', function(event, data){
    if(event.targetScope !== $scope) {
        return;
    }
    
    ctrl.photosGrid = [];
    ctrl.noPhotos = 0;
    ctrl.time = 0;
    ctrl.gameId = null;
    ctrl.flipedPhoto = null;
    ctrl.disableFlipping = false;
    ctrl.noMatches = 0;
    ctrl.score = 0;

    $ionicLoading.show({
      template: 'Loading...'
    });
    $http.get(BACKEND_URL + '/game').then(function(data){
      ctrl.time = data.data.time;
      ctrl.gameId = data.data.id;
      ctrl.noPhotos = data.data.photos.length;
      for(var r = 0; r < data.data.noRows; r++){
        var row = [];
        for(var c = 0; c < data.data.noCols; c++) {
          row.push({
            'url': data.data.photos[r * data.data.noCols + c],
            'isFlipped': false,
            'isMatched': false
          })
        }
        ctrl.photosGrid.push(row);
      }
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Can\'t load game now'
      });
      alertPopup.then(function(res) {
        history.back();
      });
    });
  });

  $scope.$on('$ionicView.beforeLeave', function(){
      if(ctrl.timer) {
          $interval.cancel(ctrl.timer);
          ctrl.timer = null;
      }
      ctrl.photosGrid = [];
      ctrl.noPhotos = 0;
      ctrl.time = 0;
      ctrl.score = 0;
  });

  

  this.flipPhoto = function(photo) {
    this.startTimer();  // if timer wasn't started, then start it...
    if(ctrl.disableFlipping || photo.isMatched) {  // Case of 2 card flipped, so skip
      return;
    }
    
    if(photo.isFlipped) { // if this card was already flipped
      photo.isFlipped =  false;
      ctrl.flipedPhoto = null;
    } else {
      photo.isFlipped =  true;
      if(ctrl.flipedPhoto == null) {  // if no other cards are flipped
        ctrl.flipedPhoto = photo;
      } else { 
        if(ctrl.flipedPhoto.url == photo.url) { // if both card are same picture
          photo.isMatched = true;
          ctrl.flipedPhoto.isMatched = true;
          ctrl.flipedPhoto = null;
          ctrl.score += 20;
          ctrl.noMatches++;
          if(ctrl.noMatches == (ctrl.noPhotos / 2)) {
            $interval.cancel(ctrl.timer);
            ctrl.score += ctrl.time;  // time bonus
            ctrl.displayWonAlert();
          }
        } else { 
          ctrl.disableFlipping = true;
          $timeout(function() {
            ctrl.flipedPhoto.isFlipped = false;
            photo.isFlipped = false;
            ctrl.flipedPhoto = null;
            ctrl.disableFlipping = false;
            $scope.$apply();
          }, 2000);
        }
      }
    }
  }

  this.startTimer = function() {
    if(ctrl.timer != null) {
      return;
    }

    ctrl.timer = $interval(function() {
      ctrl.time--;
      if(ctrl.time == 0) {
        $interval.cancel(ctrl.timer);
        ctrl.displayFailedAlert();
      }
    }, 1000);
  }

  this.displayWonAlert = function() {
    if(localStorage.getItem('userid') == null) {
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="main.username">',
        title: 'You won',
        subTitle: 'Please enter your name',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.main.username) {
                e.preventDefault();
              } else {
                return $scope.main.username;
              }
            }
          }
        ]
      });

      myPopup.then(function(res) {
        ctrl.submitScore(res);
      });
    } else {
      var alertPopup = $ionicPopup.alert({
        title: 'Game of Memory',
        template: 'You won!. Your score is: ' + ctrl.score
      });
      alertPopup.then(function(res) {
        ctrl.submitScore();
      });
    } 
  }

  this.displayFailedAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Game of Memory',
      template: 'Time finished, you lost :('
    });
    alertPopup.then(function(res) {
      history.back();
    });
  }

  this.submitScore = function(username) {
    const data = { 'gameId': ctrl.gameId, 'score': ctrl.score };
    if(username) {
      data.username = username;
    } else {
      data.userId = localStorage.getItem('userid');
    }

    $ionicLoading.show({
      template: 'Loading...'
    });
    $http({
      method: 'POST',
      url: BACKEND_URL + '/game',
      data: JSON.stringify(data)
    })
    .then(function (success) {
      localStorage.setItem('userid', success.data.id);
      $ionicLoading.hide();
      history.back();
    }, function (error) {
      console.log("error", error);
      $ionicLoading.hide();
      history.back();
    });
  }
});
