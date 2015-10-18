var app = angular
  .module('XactPet', ['ngRoute', 'ngSanitize'])
  .config(function ($routeProvider) {
    $routeProvider      
      .when('/', {
        templateUrl: 'scripts/views/store.html',
        controller: 'StoreController'
      })
      .when('/products/:id', {
        templateUrl: 'scripts/views/product.html',
        controller: 'StoreController'
      })
      .when('/cart', {
        templateUrl: 'scripts/views/cart.html',
        controller: 'StoreController'
      })
      .otherwise({
        redirectTo: '/'
    })
  })
  //I will create a custom filter for filtering multiple columns on my table. 
  //Default filter function with multiple columns just AND different columns I want to OR parameters
  .filter('myCustomTableFilter', function(){
    return function(dataArray, searchTerm) {
      //check the existance of data
      if(!dataArray){
        return;
      }
      //check if searchTerm exist and if not return the dataArray
      else if(!searchTerm){
        return dataArray;
      }
      //If there is a dataArray and searchTerm lets filter out
        else {
             // Want case insensitive search to make customer job easier
             var term = searchTerm.toLowerCase();
             // I will filter in according to three columns name, price, shortDescription
             return dataArray.filter(function(item){
                var termName = item.name.toLowerCase().indexOf(term) > -1;
                var termPrice = item.price.toString().toLowerCase().indexOf(term) > -1;
                var termShortDescription = item.shortdescription.toLowerCase().indexOf(term) > -1;
                //Or my terms
                return termName || termPrice || termShortDescription;
             });
        }
      };
  });