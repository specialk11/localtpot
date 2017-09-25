(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$http', 'UserService'];

	function SettingsController($scope, $http, UserService) {
		if(!UserService.isLoggedIn()) {
	        document.location = '/#/login';
	    }

	    $scope.loadSettings = function() {
	    	var userId = UserService.getUserId();

	    	$http.get('https://tpot.space/settings/' + userId).then(function(response) {
                if(response.status == 200) {
                    console.log(response);

                    $scope.settings = response.data;

                    $scope.college = response.data.course.college;
                    $scope.course = response.data.course.course;
                    $scope.year = response.data.course.year;

                    $scope.calendars = response.data.calendars;

                    $scope.modules = response.data.course.modules;

                    $scope.societies = response.data.societies;

                    $scope.diet = response.data.cuisine.diet;
                    $scope.dietkeys = Object.keys($scope.diet);
                    $scope.dietvalues = Object.values($scope.diet);

                    $scope.intolerances = response.data.cuisine.intolerances;
                    $scope.intoleranceskeys = Object.keys($scope.intolerances);
                    $scope.intolerancesvalues = Object.values($scope.intolerances);
                }
            });
	    }

	    $scope.loadCalendars = function() {
	    	$scope.calendars = [{title:'Primary', calendartitle:'marcin.gardas2@mail.dcu.ie'}, {title:'CPSSD', calendartitle:'CPSSD1 - CPSSD1'}];
	    }

        $scope.removeSociety = function(society) {
            var userId = UserService.getUserId();

            var data = {
                "userId": userId,
                "society": society
            }

            $http.post('https://tpot.space/settings/removeSoc', data).then(function(response) {
                console.log(response);
                if(response.status == 200) {
                    var index = $scope.societies.indexOf(society);
                    if (index > -1) {
                        $scope.societies.splice(index, 1);
                    }
                }
            });
        }

	    $scope.saveSettings = function() {
	    	var userId = UserService.getUserId();

	   		var settings = $scope.settings;
	   		settings.cuisine.diet = $scope.diet;
	   		settings.cuisine.intolerances = $scope.intolerances;

	   		var data = {
	   			userId: userId,
	   			settings: settings
	   		}

	   		console.log(data);

            $http.post('https://tpot.space/settings', data).then(function(response) {
            	console.log(response);
                if(response.status == 200) {
                    console.log('done');

                    window.componentHandler.upgradeAllRegistered();
                    var snackbarContainer = document.querySelector('#snackbar');
                    var data = {message: 'Settings Saved'};
                    snackbarContainer.MaterialSnackbar.showSnackbar(data);
                }
            });
	    }

	    $scope.init = function () {
            //$scope.loadCalendars();
            $scope.loadSettings();
        };
        $scope.init();
	}
}()
);