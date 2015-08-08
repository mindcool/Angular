angular.module('myApp', [])
	.controller('MyController', function($scope){
		console.log(angular.module('myApp').name);
		console.log(angular.module('myApp').requires);
	});