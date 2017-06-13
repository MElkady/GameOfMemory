angular.module('starter.controllers')
.controller('SettingsCtrl', function($scope) {
    this.difficulty = 1;
    const ctrl = this;

    $scope.$on('$ionicView.enter', function(event, data){
        if(event.targetScope !== $scope) {
            return;
        }
        if(localStorage.getItem("difficulty") != null) {
            ctrl.difficulty = localStorage.getItem("difficulty");
        }
    });

    $scope.$on('$ionicView.beforeLeave', function(event, data){
        if(event.targetScope !== $scope) {
            return;
        }
        localStorage.setItem("difficulty", ctrl.difficulty);
    });

});