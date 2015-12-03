/*NOTE: Authorization data is imported from Github and stored in local storage (userStore) in order to
populate user profile with Github profile picture, name, and basic information. For improvement, save data to DB when 
it is imported from Github.  
*/
// var globalCurrent;

angular.module('dvelop.auth', [])

.factory('Auth', function($firebaseAuth){
	var usersRef = new Firebase("https://dvelop-carbon.firebaseio.com/");
	return $firebaseAuth(usersRef);
})

.factory('UsersRef', function(){
	var usersRef = new Firebase("https://dvelop-carbon.firebaseio.com/");
	return usersRef;
})

.factory('UserStore', function(){
	var userStore = {};
	return userStore;
})

.controller('AuthController', function($scope, Auth, $location, UsersRef, UserStore,$rootScope){
	Auth.$onAuth(function(authData){
		$scope.authData = authData;

		if (authData === null){
			console.log('User is not logged in yet.');
		} else {
			console.log('User logged in as ', authData);
			$rootScope.globalCurrent = authData.uid.substr(7)
			$location.path('/search')
		}
	})

	$scope.login = function(){
		Auth.$authWithOAuthPopup("github")
			.then(function(authData){
				if (UserStore[authData.github.id]){
					$location.path('/search');
					// globalCurrent = Object.keys(UserStore)
				} else{	
					// globalCurrent = Object.keys(UserStore)
					UserStore[authData.github.id] = {
						userID: authData.github.id,
						displayName: authData.github.displayName,
						email: authData.github.email,
						imageURL: authData.github.profileImageURL
					}
				}
				console.log(UserStore); 
				$location.path('/signup');

			})
	}
})

.factory('logout', function(Auth, $location){
		var logoutFn = function(){
			Auth.$unauth();	
			$location.path('/auth')
			console.log('This was fired!');
		}
		return {logout: logoutFn};
});

