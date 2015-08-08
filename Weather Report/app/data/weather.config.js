(function() {
	angular.module("app.data")
		.value("weatherImgUrl", "http://openweathermap.org/img/w/")
		.value("weatherSvcUrl", "http://api.openweathermap.org/data/2.5/")
		.value("countyFlagImgUrl", "http://openweathermap.org/images/flags/");
})();