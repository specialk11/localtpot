(function($) {
    'use strict';
    
    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$http', 'UserService'];

    function LoginController($scope, $http, UserService) {
    	if(UserService.isLoggedIn()) {
	        document.location = '/';
	    }

        $scope.title = 'Login';
    }
}()
);