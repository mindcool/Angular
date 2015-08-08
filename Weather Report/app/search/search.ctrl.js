(function(){
	angular.module("app.search")
		.controller("Search", function($scope, weatherSvc){
			$scope.cities = null;

			$scope.$on("search", search);

			function search(evt,data) {
				weatherSvc.find(data.str)
					.then(
						function(response) {
							$scope.cities = response.list;
						},
						function(err) {
							console.log("error finding cities: ", err);
						}
					)
			}
		});
})();