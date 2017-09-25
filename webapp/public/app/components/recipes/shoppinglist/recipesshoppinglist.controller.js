(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('RecipesShoppinglistController', RecipesShoppinglistController)
        .directive('shoppinglist', shoppinglist);

	RecipesShoppinglistController.$inject = ['$scope', '$http', 'UserService'];

	function RecipesShoppinglistController($scope, $http, UserService) {
        $scope.doneShopping = function() {
            $http.post('http://tpot.space:80/recipes/doneshopping/').then(function(response) {
                if(response.status == 200) {
                    document.location = '/#/recipes'; //should include the date
                }
            });
        }

		$scope.loadShoppinglist = function() {
            $http.get('http://tpot.space:80/recipes/shoppinglist').then(function(response) {
                var shoppinglist = response.data.shoppinglist;
                console.log(shoppinglist);
                $scope.shoppinglist = shoppinglist;
            });
        }

        $scope.init = function () {
            $scope.loadShoppinglist();
        };
        $scope.init();
	}

    shoppinglist.$inject = ['$http', 'UserService'];

    function shoppinglist($http, UserService) {
        return {
            require: 'ngModel',
            templateUrl: 'app/components/recipes/shoppinglist/recipesshoppinglist.template.html'
        };
    }
}()
);