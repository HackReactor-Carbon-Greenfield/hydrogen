angular.module('dvelop.signup', ['dvelop.auth'])

.controller('SignupController', function ($scope, UserStore, UserFactory, Auth, $location, logout){
 
 $scope.user = UserFactory;
 $scope.currentUser;
 $scope.logout = logout.logout;

 //Populate form new user's Github data
 Auth.$onAuth(function(authData){
   $scope.authData = authData;
   $scope.currentUser = UserStore[$scope.authData.github.id];

   var name = $scope.currentUser.displayName;

   $scope.user.displayName = $scope.currentUser.displayName;
   $scope.user.emailAddress = $scope.currentUser.email;

   $scope.user.profileImageUrl = $scope.currentUser.imageURL;
 });

 $scope.saveData = function(){
   var userRef = new Firebase("https://dvelop-carbon.firebaseio.com/users"); 
   userRef.child($scope.authData.github.id).update($scope.user);
   $location.path('/search'); //object version
 };

})

.factory('UserFactory', function() {
 var user = {};
 return user;
});
