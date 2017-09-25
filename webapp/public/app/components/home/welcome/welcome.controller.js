(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('WelcomeController', WelcomeController);

	WelcomeController.$inject = ['$scope', '$http', 'UserService'];

	function WelcomeController($scope, $http, UserService) {
	    $scope.done = function() {
            var userId = UserService.getUserId();

	    	var data = {
                "userId": userId,
                "college": $scope.college,
                "course": $scope.coursecode,
                "year": $scope.year
            }
            console.log(JSON.stringify(data));

            $http.post('https://tpot.space/settings/course', data).then(function(response) {
                console.log(response);
                if(response.status == 200) {
                    document.location = '/';
                }
            });
	    }

	    $scope.init = function () {
            
        };
        $scope.init();
	}
}()
);