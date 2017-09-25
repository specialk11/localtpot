(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('RecipesSpecialoffersController', RecipesSpecialoffersController);

	RecipesSpecialoffersController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function RecipesSpecialoffersController($scope, $http, $stateParams, UserService) {
		function loadSpecialoffers() {
            var userId = UserService.getUserId();

            $http.get('https://tpot.space/specials').then(function(response) {
                var specialoffers = response.data;
                var specialoffertypes = [];
                for(var type in specialoffers) {
                	for(var specialoffer in specialoffers[type]) {
                        if(specialoffertypes.indexOf(specialoffers[type][specialoffer].category) > -1) {
                            
                        } else {
                            specialoffertypes.push(specialoffers[type][specialoffer].category);
                        }
                    }
                }
                $scope.specialoffertypes = specialoffertypes;
            });
        }

        $scope.init = function () {
            loadSpecialoffers();
        };
        $scope.init();
	}
}()
);