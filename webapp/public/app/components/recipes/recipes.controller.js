(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('RecipesController', RecipesController);

	RecipesController.$inject = ['$scope', '$http', 'UserService'];

	function RecipesController($scope, $http, UserService) {
		if(!UserService.isLoggedIn()) {
	        document.location = '/#/login';
	    }

        function loadRecipes() {
            var userId = UserService.getUserId();
            var day = $scope.day;

            console.log('https://tpot.space/recipes/getDay/' + userId + '/' + day);
            $http.get('https://tpot.space/recipes/getDay/' + userId + '/' + day).then(function(response) {
                console.log(response.data);
                if(response.data == '') {
                    var recipes = {};
                } else {
                    var recipesdata = response.data;
                    var recipes = {};
                    recipesdata.forEach(function(recipe) {
                        var meal = Object.keys(recipe)[0];
                        recipes[meal] = recipe[meal];
                    });
                }
                console.log(recipes);
                $scope.recipe = recipes;
            });
        }

        function setDay(date) {
            var day = date.getDate();
            if (day < 10) day = '0' + day;
            var month = date.getMonth()+1;
            if (month < 10) month = '0' + month;
            var year = date.getFullYear()
            return '' + year + month + day;
        }

        $scope.changeDate = function(offset) {
            $scope.date.setDate($scope.date.getDate() + offset);
            $scope.day = setDay($scope.date);
            if($scope.date.getDate() == new Date().getDate() && $scope.date.getMonth() == new Date().getMonth()) {
                $scope.datename = 'Today';
            } else {
                $scope.datename = moment($scope.date.toISOString()).format("dddd Do MMMM");
            }
            loadRecipes();
        };

        $scope.unassignRecipe = function() {
            $http.post('https://tpot.space/recipes/remove/').then(function(response) {
                if(response.status == 200) {
                    console.log("unassigned");
                    document.location = '/#/recipes'; //should include the date
                }
            });
        };

        $scope.init = function () {
            $scope.date = new Date();
            $scope.day = setDay($scope.date);

            $scope.changeDate(0);
        };
        $scope.init();
	}
}()
);