(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('SettingsAddsocietiesController', SettingsAddsocietiesController);

	SettingsAddsocietiesController.$inject = ['$scope', '$http', 'UserService'];

	function SettingsAddsocietiesController($scope, $http, UserService) {
		if(!UserService.isLoggedIn()) {
	        document.location = '/#/login';
	    }

	    $scope.loadSocieties = function() {
	    	var userId = UserService.getUserId();

            $http.get('https://tpot.space/soc/' + userId).then(function(response) {
                var societies = response.data.societies;

                $http.get('https://tpot.space/settings/' + userId).then(function(response) {
	                if(response.status == 200) {
	                	var mysocieties = response.data.societies;

	                	console.log(societies);
	                	console.log(mysocieties);

	                	societies = societies.filter(function(el) {
						  	return mysocieties.indexOf(el) < 0;
						});

	                	$scope.societiesselected = [];
		                for(var i = 0; i < societies.length; i++) {
		                	$scope.societiesselected.push(false);
		                }
		                $scope.societies = societies;
		                $scope.societieskeys = Object.keys($scope.societies);
                        
                        componentHandler.upgradeAllRegistered();
	               	}
	          	});
            });
	    }

        $scope.addSocieties = function() {
        	var userId = UserService.getUserId();

        	var societies = [];
        	for(var i = 0; i < $scope.societies.length; i++) {
            	if($scope.societiesselected[i] == true) {
            		societies.push($scope.societies[i]);
            	}
            }

            var data = {
                "userId": userId,
                "societies": societies
            }

            console.log(JSON.stringify(data));

            $http.post('https://tpot.space/settings/insertSocs', data).then(function(response) {
                console.log(response);
                if(response.status == 200) {
                	document.location = '/#/settings';
                }
            });
        }

	    $scope.init = function () {
            $scope.loadSocieties();
        };
        $scope.init();
	}
}()
);