
app.controller("StoreController", function($scope, appData, $routeParams, $sce, $filter){
	
	getProductList();
	$scope.sortType     = 'name'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.searchFood   = '';     // set the default search/filter term
	$scope.products.getProduct = function(id){
		for (var i = 0; i < $scope.products.length; i++) {
		    if ($scope.products[i].id == id)
		      return $scope.products[i];
		}
		return null;
	}

	function getProductList(){
		if(!$scope.products){
		$scope.products = [];
		}
		appData.getProductData().then(function(data){
			for(var i = 0; i < data.data.length; i++) {
            	$scope.products.push(new Product(data.data[i].id, data.data[i].name, data.data[i].price, data.data[i].shortDescription, data.data[i].longDescription, data.data[i].directions, data.data[i].ingredients));
        	}
        console.log($scope.products);
		})
	}

	if ($routeParams.id != null) {
		$scope.product = $scope.products.getProduct($routeParams.id);
	}


	//----------------------------------------------------------------
	// product class
	function Product(id, name, price, shortdescription, longdescription, directions, ingredients) {
	    this.id = id;
	    this.name = name;
	    this.price = price;
	    this.shortdescription = shortdescription;
	    this.longdescription = longdescription;
	    this.directions = directions;
	    this.ingredients = ingredients;
	}
	
});