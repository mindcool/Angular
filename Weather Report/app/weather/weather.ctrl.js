(function(){
	angular.module("app.weather")
		.controller("Weather", function($scope, $routeParams, weatherSvc) {

			$scope.current = null;

			if($routeParams.id !== undefined) {
				getCurrent($routeParams.id);
			}

			function getCurrent(id) {
				weatherSvc.getCurrent(id)
					.then(function(response){
						$scope.current = response;
					},
					function(err){
						console.log("Error loading current weather data: ", err);
					})
			}
		});
})();