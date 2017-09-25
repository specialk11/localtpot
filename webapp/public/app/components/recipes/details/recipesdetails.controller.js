(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('RecipesDetailsController', RecipesDetailsController);

	RecipesDetailsController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function RecipesDetailsController($scope, $http, $stateParams, UserService) {
        $scope.recipe = $stateParams.recipe;

		$scope.loadIngredients = function() {
            $http.get('https://tpot.space/recipes/info/' + $scope.recipe).then(function(response) {
                console.log(response.data);
                $scope.title = response.data.title;
                $scope.image = response.data.image;
                $scope.instructions = response.data.instructions;
                var ingredients = response.data.extendedIngredients;
                $scope.ingredients = ingredients;
            });
        }

        $scope.init = function () {
            $scope.loadIngredients();
        };
        $scope.init();
	}
}()
);