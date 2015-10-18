
app.controller("StoreController", function($scope, appData, $routeParams, $sce, $window){
	

	$scope.sortType     = 'name'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.searchFood   = '';     // set the default search/filter term
	$scope.items = [];
	getProductList();
	//Load cart from local storage
	loadRemoteData();
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

	//Add or remove items from the cart
	$scope.addItem = function(id, name, price, quantity){
		quantity = isNaN(quantity) ? 0 : quantity;
		//If quantity not zero so there is an item to add
	    if (quantity != 0) {
	    	var itemFound = false;
	    	//Iterate through items array
	        for (var i = 0; i < $scope.items.length; i++) {
	            var item = $scope.items[i];
	            if (item.id == id) {
	                itemFound = true;
	            	//Update the quantity of item
	                item.quantity = item.quantity.toNumber() + quantity.toNumber();
	                //If item deleted remove it from $scope.items array
	                if (item.quantity <= 0) {
	                    $scope.items.splice(i, 1);
	                }
	            }
	        }
	        // If there is no item in the $scope.items parameter we should add it
	        if (!itemFound) {
	            var item = new cartItem(id, name, price, quantity);
	            $scope.items.push(item);
	        }

	        // save changes
	        $scope.saveItems();
	    }
	}

	//Get the number of items in the cart
	$scope.getTotalCount = function(id){
	    var count = 0;
	    for (var i = 0; i < $scope.items.length; i++) {
	        var item = $scope.items[i];
	        //If id is empty count all items if there is an id just count the # of that items
	        if (id == null || item.id == id) {
	            count += isNaN(item.quantity) ? 0 : item.quantity;;
	        }
	    }
	    return count;
	}

	//Get the total price of our cart items
	$scope.getTotalPrice = function(id){
		var total = 0;
	    for (var i = 0; i < $scope.items.length; i++) {
	        var item = $scope.items[i];
	        if (id == null || item.id == id) {
	            total += isNaN(item.quantity * item.price) ? 0 : item.quantity * item.price;
	        }
	    }
	    return total;
	}

	//Clear shopping cart
	$scope.clearItems = function() {	

	}
	//Check out the cart
	$scope.checkout = function(){

	}

	//Remove the item from the cart
	$scope.removeItem = function(item) {
		
	}

	$scope.saveItems = function() {
		if (localStorage != null) {
			//Synchorinizing localstorage items with $scope.items, do not forget to serialize
        	localStorage["Xactpet_items"] = JSON.stringify($scope.items);
    	}
	}

	// ---
    // PRIVATE METHODS.
    // ---

    // Populating $scope.items array
    function loadRemoteData() {
    	//If local storage not empty load from local storage if empty just return NULL
    	var items = localStorage != null ? localStorage["Xactpet_items"] : [];

	    if (items != null) {
	        try {
	        	//We should deserialize items array
	            var items = JSON.parse(items);
	            for (var i = 0; i < items.length; i++) {
	                var item = items[i];
	                //Make sure the return item got all properties set
	                if (item.id != null && item.name != null && item.price != null && item.quantity != null) {
	                    item = new cartItem(item.if, item.name, item.price, item.quantity);
	                    $scope.items.push(item);
	                }
	            }
	        }
	        catch (err) {
	            // ignore errors while loading...
	        }
	    }
	    console.log("Cart has following items"+$scope.items);
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

    //----------------------------------------------------------------
	// cartItem class
    function cartItem(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
	}

});