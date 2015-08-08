angular.module('myApp', [])
	.controller('MyController', function($scope, $timeout) {
		$scope.clock = {};
		var changeTime = function() {
			$scope.clock.now = new Date();
			$timeout(function() {
				changeTime();
			},1000)
		};
		changeTime();
	});