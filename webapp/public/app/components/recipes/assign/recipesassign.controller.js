(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('RecipesAssignController', RecipesAssignController);

	RecipesAssignController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function RecipesAssignController($scope, $http, $stateParams, UserService) {
        $scope.date = $stateParams.date;
        $scope.meal = $stateParams.meal;
        $scope.recipe = $stateParams.recipe;
        console.log($scope.meal);

        function setDay(date) {
            var day = date.getDate();
            if (day < 10) day = '0' + day;
            var month = date.getMonth()+1;
            if (month < 10) month = '0' + month;
            var year = date.getFullYear()
            return '' + year + month + day;
        }

        $scope.assignRecipe = function() {
            var userId = UserService.getUserId();
            var recipe = $scope.recipe;
            var date = $scope.date;
            var meal = $scope.meal;
            var title = $scope.title;
            var image = $scope.image;

            var data = {
                "userId": userId,
                "day": date,
                "meal": {
                    [$scope.meal]: {
                        "id": recipe,
                        "title": title,
                        "image": image
                    }
                }
            }

            console.log(JSON.stringify(data));

            $http.post('https://tpot.space/recipes/insert', data).then(function(response) {
                $scope.day = $scope.date;
                $scope.date = new Date($scope.date.substring(0,4), $scope.date.substring(4,6) - 1, $scope.date.substring(6,8));
                var date = $scope.date;

                var weekStart = new Date()
                weekStart.setDate($scope.date.getDate() - $scope.date.getDay() + 1);
                weekStart = setDay(weekStart);

                $scope.amount = $scope.price;
                $scope.details = $scope.meal[0].toUpperCase() + $scope.meal.slice(1) + " Recipe";

                var data = {
                    "userId": userId,
                    "input": {
                        "weekStart": weekStart,
                        "date": $scope.day,
                        "details": {
                            "amount": $scope.amount,
                            "summary": $scope.details
                        }
                    }
                }

                console.log(JSON.stringify(data));

                $http.post('https://tpot.space/finance/insert', data).then(function(response) {
                    if(response.status == 200) {
                        document.location = '/#/recipes'; //should include the date
                    }
                });
            });
        }

		$scope.loadIngredients = function() {
            $http.get('https://tpot.space/recipes/info/' + $scope.recipe).then(function(response) {
                console.log(response.data);
                $scope.title = response.data.title;
                $scope.image = response.data.image;
                $scope.price = response.data.pricePerServing;
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