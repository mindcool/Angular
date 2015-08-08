var app = angular.module("computer", ['ngRoute'])
	.config(function($routeProvider){
		$routeProvider
		.when("/main", {
				templateUrl: "main.html",
				controller: "MainCtrl"
			})
		.when("/about", {
				templateUrl: "about.html",
				controller: "MainCtrl"
			})
		.when("/contact", {
				templateUrl: "contact.html",
				controller: "ContactCtrl"
			})
		.when("/services", {
				templateUrl: "services.html",
				controller: "ServicesCtrl"
			})
		.otherwise({
			redirectTo: "/main"
		});
	})
	.controller("MainCtrl", function($scope, $http){
		$http.get('services.json').then(function(response){
			$scope.services = response.data;
		});
	})

	.controller("ContactCtrl", function($scope, $http){
		$http.get('locations.json').then(function(response) {
			$scope.locations = response.data;
		});
	})
	
	.controller("ServicesCtrl", function($scope, $http){
		$http.get('services.json').then(function(response){
			$scope.services = response.data;
		});
	});