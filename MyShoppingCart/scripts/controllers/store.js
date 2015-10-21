
app.controller("StoreController", function($scope, appData, $routeParams, $sce, $window, toaster, $filter){
	$scope.sortType     = 'name'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.searchFood   = '';     // set the default search/filter term
	//After checkout if the user close the application the state of cart should be saved to the localstorage
	$scope.clearCart 	= false;
	$scope.items = [];
	getProductList();
	//Load cart from local storage
	loadRemoteData();

	$scope.getProduct = function(id){
		if(!$scope.product){
			$scope.product = {};
		}
		appData.getProductData().then(function(data){
			for(var i = 0; i < data.data.length; i++) {
				if(data.data[i].id == id) {
					$scope.product = new Product(data.data[i].id, data.data[i].name, data.data[i].price, data.data[i].shortDescription, data.data[i].longDescription, data.data[i].directions, data.data[i].ingredients);
				}
        	}
		})
	}

	// save the stage of card if there is no checkout
	$window.addEventListener( "beforeunload", function(){
		if ($scope.clearCart) {
			//If checkout done clear cart before unload
			$scope.clearItems();
		}
			//Do not clear cart because there is no checkout save cart for customer return
			$scope.saveItems();
			$scope.clearCart = false;
	});

	function getProductList(){
		if(!$scope.products){
		$scope.products = [];
		}
		appData.getProductData().then(function(data){
			for(var i = 0; i < data.data.length; i++) {
            	$scope.products.push(new Product(data.data[i].id, data.data[i].name, data.data[i].price, data.data[i].shortDescription, data.data[i].longDescription, data.data[i].directions, data.data[i].ingredients));
        	}
		})
	}

	if ($routeParams.id != null) {
		$scope.getProduct($routeParams.id);
	}

	//Add or remove items from the cart
	$scope.addItem = function(id, name, price, quantity){
		quantity = isNaN(quantity) ? 0 : quantity;
		if($scope.getTotalCount(id) + quantity > 100) {
			toaster.pop('error', 'Max  100 of any one item');
			return;
		}
		//If quantity not zero so there is an item to add
	    if (quantity != 0) {
	    	var itemFound = false;
	    	//Iterate through items array
	        for (var i = 0; i < $scope.items.length; i++) {
	            var item = $scope.items[i];
	            if (item.id == id) {
	                itemFound = true;
	            	//Update the quantity of item
	                item.quantity = item.quantity + (isNaN(quantity) ? 0 : quantity);
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
	            count += (isNaN(item.quantity) ? 0 : item.quantity);
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
		$scope.items = [];
    	$scope.saveItems();
	}
	//Check out the cart
	$scope.checkout = function(){
		$scope.checkoutform = "";
		$scope.checkoutform += "<table class='table table-bordered table-striped'><thead>";

		$scope.checkoutform += "<tr class='well'><td class='tdRight' colspan='4'>Items Shipped To: <i class='icon-envelope'></i> "+$scope.email+" Total Price:"+$filter('currency')($scope.getTotalPrice())+"</b></td></tr><tr><td>Name</td><td>Quantity</td><td>Total Price</td></tr></thead>";
		for (var i = 0; i < $scope.items.length; i++) {
			$scope.checkoutform += "<tr><td>"+$scope.items[i].name+"</td><td>"+$scope.items[i].quantity+"</td><td>"+$filter('currency')($scope.items[i].price * $scope.items[i].quantity)+"$ </td></tr>"
		}
		$scope.checkoutform += "</table>";
		$scope.clearCart = true;
		$scope.clearItems();
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
	                    item = new cartItem(item.id, item.name, item.price, item.quantity);
	                    $scope.items.push(item);
	                }
	            }
	        }
	        catch (err) {
	            // ignore errors while loading...
	        }
	    }
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