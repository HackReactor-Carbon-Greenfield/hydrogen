angular.module('dvelop.connections', ['dvelop.auth'])
  .controller('ConnectionsController', ['$scope', '$rootScope', '$firebaseArray',
    function($scope, $rootScope, $firebaseArray) {

      var usrs = new Firebase("https://dvelop-carbon.firebaseio.com/users");
      var crntUsr = new Firebase("https://dvelop-carbon.firebaseio.com/users/" + $rootScope.currentUser);

      console.log(usrs);
      console.log($rootScope.currentUser);

      usrs.on('value', function(snapshot) {
        //console.log(snapshot.val());
      });

      crntUsr.on('value', function(snapshot) {
        //console.log(snapshot.val());
      });


      usrs.on("value", function(snapshot) {
        console.log(snapshot.val());
        //console.log($rootScope.currentUser);
        console.log(snapshot.val()[$rootScope.currentUser]);
        var usrArray = $firebaseArray(snapshot);
        usrArray.$add({connectsions: {}})
          .then(function() {
            console.log(snapshot.val());
          });
        console.log(snapshot.val()[$rootScope.currentUser].pending);
        console.log(snapshot.val()[$rootScope.currentUser].approved);

        var currUsr = $rootScope.currentUser;
        var allUserKeys = Object.keys(snapshot.val());
        var conn = snapshot.val()[currUsr].connections.approved || [];
        var pend = snapshot.val()[currUsr].connections.pending || [];

        var potentialConnections = function(usr_collection) {
          var notConnected = [];
          for (var i = 0; i < usr_collection.length; i++) {
            console.log(conn);
            //console.log(usr_collection[i]);
            if (conn.indexOf(usr_collection[i]) < 0) {
              notConnected.push(snapshot[usr_collection[i]]);
            }
          }
          return notConnected;
        };
        console.log(potentialConnections(allUserKeys));

      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  ]);


/*var usersCollection = new Firebase('https://dvelop-carbon.firebaseio.com/users');
 $scope.users = $firebaseArray(usersCollection);
 var currentUser = new Firebase('https://dvelop-carbon.firebaseio.com/users/' + $rootScope.currentUser);
 // check for a connections property on the current user. If it's not
 // there, add it to the user with two sub properties, pending and
 // approved.
 //connectionsProperty(currentUser);

 // add the given user to the current user's connections
 //$scope.addConnections = function(aUser) {
 //  addConnections();
 //};

 // find all the users that the current users isn't connected with
 var userIDs = Object.keys(usersCollection);
 var disconnected = currentUser.on('value', function(snapshot) {
 var disconnectedUsers = [];
 for (var i = 0; i < userIDs.length; i++) {
 if (!snapshot.connections.approved.indexOf(userIDs[i])) {
 disconnectedUsers.push(userIDs[i]);
 }
 }
 return disconnectedUsers;
 });
 // data to render for the disconnected users
 $scope.users = $firebaseArray(usersCollection);
 $scope.potential = disconnected;
 }
 ])
 .factory('aService', function(){
 console.log('a ');
 })
 .factory('connectionsProperty', function(aUser) {
 //console.log('I was called');


 // check for a connections property
 //var checkForConnectionsProperty = aUser.on('value', function(snapshot) {
 //  return !snapshot.connections;
 //}, function(errorObject) {
 //  console.log('The read failed: ' + errorObject.code);
 //});
 //// add connections property if it's not there
 //if (!checkForConnectionsProperty) {
 //  aUser.set({
 //    connections: {
 //      pending: [],
 //      approved: []
 //    }
 //  });
 //}
 })
 .factory('addConnections', function() {
 console.log(this);
 })
 .factory('removeConnections', function(aUser) {

 })
 .factory('findDisconnections', function(aUser) {

 })
 .factory('findConnections', function(aUser) {

 });*/