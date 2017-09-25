(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('TransportController', TransportController);

	TransportController.$inject = ['$scope', '$http', '$geolocation', 'UserService'];

	function TransportController($scope, $http, $geolocation, UserService) {
		$scope.isEmpty = function (obj) {
		    for (var i in obj) if (obj.hasOwnProperty(i)) return false;
		    return true;
		};
		
	    $scope.loadStops = function() {
	    	$geolocation.getCurrentPosition().then(function(position) {
	    		var latitude = position.coords.latitude;
	    		var longitude = position.coords.longitude;

	    		console.log('https://tpot.space/transport/' + latitude + '/' + longitude);

	    		$http.get('https://tpot.space/transport/' + latitude + '/' + longitude).then(function(response) {
	    			console.log(response);
	                $scope.stops = response.data;
	            });
			});
	    }

	    $scope.init = function () {
           $scope.loadStops();
        };
        $scope.init();
	}
}()
);