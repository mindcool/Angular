(function(){
	angular.module("app.shell")
		.controller("Shell", function($scope, weatherSvc){
			$scope.getWeatherImgUrl = weatherSvc.getWeatherImgUrl;
            $scope.getCountryFlagImgUrl = weatherSvc.getCountryFlagImgUrl;
            $scope.kelvinToDegree = weatherSvc.kelvinToDegree;
            $scope.getTime = weatherSvc.getTime;
		});
})();