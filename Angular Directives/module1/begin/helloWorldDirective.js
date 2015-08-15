//Lets start with a wrapper function (Self invoking function) to encapsulate the functionality
(function(){
	var app = angular.module('directivesModule', []);

	app.directive('helloWorld', function(){
		return {
			template: 'Hello World'
		};
	});
}());