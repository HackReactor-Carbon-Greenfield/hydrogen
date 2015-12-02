angular.module('dvelop.connections', ['dvelop.auth'])
  .controller('ConnectionsController', ['$scope', '$firebaseArray',
    function ($scope, $firebaseArray) {
      $scope.users = $firebaseArray(new Firebase("https://dvelop-carbon.firebaseio.com/users"));
      console.log($scope);
      console.log($scope.users);
    }
  ]);