(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('RecipesSpecialofferController', RecipesSpecialofferController);

	RecipesSpecialofferController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function RecipesSpecialofferController($scope, $http, $stateParams, UserService) {
        $scope.specialofferstype = $stateParams.specialofferstype;

		function loadSpecialoffers() {
            var userId = UserService.getUserId();

            $http.get('https://tpot.space/specials').then(function(response) {
                var specialoffers = response.data;
                console.log(specialoffers);
                var supervalu = [];
                var tesco = [];

            	var supervalutemp = specialoffers.supervalu;
            	for(var i = 0; i < supervalutemp.length; i++) {
                    if(supervalutemp[i].category == $scope.specialofferstype) {
                        supervalutemp[i].store = 'Supervalu';
                        supervalu.push(supervalutemp[i]);
                    }
            	}

            	var tescotemp = specialoffers.tesco;
            	for(var i = 0; i < tescotemp.length; i++) {
                    if(tescotemp[i].category == $scope.specialofferstype) {
                		tescotemp[i].store = 'Tesco';
                		tesco.push(tescotemp[i]);
                    }
            	}
                
                console.log(tesco);
                $scope.specialoffers = supervalu.concat(tesco);
            });
        }

        $scope.init = function () {
            loadSpecialoffers();
        };
        $scope.init();
	}
}()
);