(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('RecipesSearchController', RecipesSearchController);

	RecipesSearchController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function RecipesSearchController($scope, $http, $stateParams, UserService) {
        $scope.date = $stateParams.date;
        $scope.meal = $stateParams.meal;

		$scope.loadRecipesSearch = function(text) {
            var userId = UserService.getUserId();

            $http.get('https://tpot.space/recipes/search/' + userId + '/' + text).then(function(response) {
                var recipessearch = response.data.results;
                console.log(recipessearch);
                $scope.recipessearch = recipessearch;
            });
        }
	}
}()
);