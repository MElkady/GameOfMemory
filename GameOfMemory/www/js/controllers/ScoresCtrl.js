angular.module('starter.controllers')
.controller('ScoresCtrl', function($scope, $http, $ionicLoading, $ionicPopup, BACKEND_URL) {
  this.highScores = [];
  this.userId = localStorage.getItem('userid');
  const ctrl = this;

  $scope.$on('$ionicView.enter', function(event, data){
    if(event.targetScope !== $scope) {
        return;
    }
    
    $ionicLoading.show({
      template: 'Loading...'
    });
    $http.get(BACKEND_URL + '/scores').then(function(data){
      ctrl.highScores = data.data;
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Can\'t load scores now'
      });
      alertPopup.then(function(res) {
        history.back();
      });
    });
  });
});