(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('SocietiesAddController', SocietiesAddController);

	SocietiesAddController.$inject = ['$scope', '$http', 'SocietiesService'];

	function SocietiesAddController($scope, $http, SocietiesService) {
        var college = SocietiesService.getCookie('college');
        var email = SocietiesService.getCookie('email');
        var password = SocietiesService.getCookie('password');
        var society = SocietiesService.getCookie('society');

	    $scope.eventadd = function() {
            var data = $scope.date.split('-');
            data = data.reverse();
            data = data.join('');

	    	var data = {
                "name": society,
                "event": {
                    "summary": $scope.summary,
                    "description": $scope.description,
                    "location": $scope.location,
                    "date": data,
                    "start": $scope.timestart,
                    "end": $scope.timeend
                }
            }

            var req = {
                method: 'POST',
                url: 'https://tpot.space/soc/insert/',
                headers: {
                    'college': college,
                    'email': email,
                    'password': password
                },
                data: data
            }

            console.log(JSON.stringify(req));

            $http(req).then(function(response) {
                console.log(response);
                if(response.status == 200) {
                    document.location = '/#/societies';
                }
            });
	    }

	    $scope.init = function () {
            $scope.timestart = '14.00';
            $scope.timeend = '15.00';
            $scope.date = '24-04-2017';
        };
        $scope.init();
	}
}()
);