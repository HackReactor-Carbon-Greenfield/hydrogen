angular.module('dvelop.signup', ['dvelop.auth'])
  .controller('SignupController', function($scope, $rootScope, UserStore, Auth, $location) {
    $scope.user = {};
    $scope.currentUser;
    //Populate form new user's Github data
    Auth.$onAuth(function(authData) {
      $scope.authData = authData;
      $scope.currentUser = UserStore[$scope.authData.github.id];
      var name = $scope.currentUser.displayName;
      $scope.user.displayName = $scope.currentUser.displayName;
      $scope.user.emailAddress = $scope.currentUser.email;
      $scope.user.birthday = "";
      $scope.user.professionalLevel = "";
      $scope.user.profileImageUrl = $scope.currentUser.imageURL;
      $scope.user.address = '';
      $scope.user.bestAt = '';
      $scope.user.helpAvail = true;
      $scope.user.job = '';
      $scope.user.mentorAvail = true;
      $scope.user.connections = {
        pending: [],
        approved: []
      };
    });
    $scope.saveData = function() {
      var userRef = new Firebase("https://dvelop-carbon.firebaseio.com/users");
      userRef.child($scope.authData.github.id).update($scope.user);
      $location.path('/search'); //object version
    }
  });
