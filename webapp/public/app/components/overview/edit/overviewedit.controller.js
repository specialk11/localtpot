(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('OverviewEditController', OverviewEditController);

	OverviewEditController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function OverviewEditController($scope, $http, $stateParams, UserService) {
        $scope.init = function () {
            
        };
        $scope.init();
	}
}()
);