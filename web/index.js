angular.module('instabox', [])
  .controller('IndexController', ['$scope', '$timeout', function($scope, $timeout) {
    var socket = io.connect(window.location.href);
    var photos = [];
    var currentPhotoIndex = 0;
    var timer = 3000;
    var changePhoto = function() {
      $timeout(function() {
        currentPhotoIndex++;
        if(currentPhotoIndex >= photos.length) currentPhotoIndex = 0;
        $scope.photo = photos[currentPhotoIndex];
        changePhoto();
      }, timer);
    };

    socket.on('init', function (data) {
      $scope.$apply(function() {
        $scope.isDebug = data.debug;
        $scope.searchTag = data.searchTag;
      });
    });
    socket.on('photo', function (data) {
      if(photos.length === 0)  {
        $scope.$apply(function() {
          $scope.photo = data;
        });
        changePhoto();
      }
      photos.push(data);
    });
  }]);
