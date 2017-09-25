(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('SocietiesLoginController', SocietiesLoginController);

	SocietiesLoginController.$inject = ['$scope', '$http', 'SocietiesService'];

	function SocietiesLoginController($scope, $http, SocietiesService) {
	    $scope.signin = function() {
	    	var college = $scope.college;
	    	var email = $scope.email;
	    	var password = $scope.password;

	    	console.log(college);
	    	SocietiesService.login(college, email, password);

            document.location = '/#/societies';
	    }

	    $scope.init = function () {
            
        };
        $scope.init();
	}
}()
);