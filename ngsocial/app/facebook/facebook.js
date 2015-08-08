'use strict';

angular.module('ngSocial.facebook', ['ngRoute', 'ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])

.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('1621102828175018');
  $facebookProvider.setPermissions("email, public_profile, user_posts, publish_actions, user_photos");
})
 
.run( function( $rootScope ) {
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
})

.controller('FacebookCtrl', ['$scope', '$facebook', function($scope, $facebook) {
	$scope.isLoggedIn = false;
  refresh();
	$scope.login = function() {
		$facebook.login().then(function(){
			refresh();
		});
	};

  $scope.logout = function() {
    $facebook.logout().then(function(){
      $scope.isLoggedIn = false;
      refresh();
    });
  };

  function refresh() {
    $facebook.api("/me",{fields: 'last_name, first_name, email, gender, locale, link'}).then(function(response) {
      //Just setting this parameter to show different content to user in according to their log in statue
      $scope.isLoggedIn = true;
      $scope.welcomeMsg = "Welcome " + response.first_name;
      //Just saving whole response object to a variable
      $scope.userInfo = response;
      $facebook.api("/me/picture").then(function(response){
        $scope.picture = response.data.url;
        $facebook.api('/me/permissions').then(function(response){
          $scope.permissions = response.data;
          $facebook.api('/me/posts').then(function(response){
            $scope.posts = response.data;
          });
        })
      })
    }, function(err) {
      $scope.welcomeMsg = "Please Log In";
    });
  }

    $scope.postStatus = function() {
      console.log("Submit Button Clicked");
      var body = $scope.myPost;
      console.log("Message taken"+ body);
      $facebook.api('/me/feed', 'post', {message: body}).then(function(response){
          $scope.msg = "Thanks for posting";
          $scope.myPost = "";
          refresh();
      });
  };
}]);