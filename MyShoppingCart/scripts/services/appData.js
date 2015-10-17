app.service("appData", function($http) {
	//Read Product JSON file and return promise
	this.getProductData = function() {
		return $http.get('../../json/products.json');
	};
});