(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('OverviewAddController', OverviewAddController);

	OverviewAddController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function OverviewAddController($scope, $http, $stateParams, UserService) {

        $scope.add = function() {
            var userId = UserService.getUserId();

            var newdatemin = $scope.newdate + "T" + $scope.newtimestart + ":00Z";
            var newdatemax = $scope.newdate + "T" + $scope.newtimeend + ":00Z";

            var data = {
                "userId": userId,
                "calendarId" : "primary",
                "summary": $scope.newsummary,
                "location": $scope.newlocation,
                "description": $scope.newdescription,
                "timeMin": newdatemin,
                "timeMax": newdatemax
            }

            console.log(JSON.stringify(data));

            $http.post('https://tpot.space/tasks/insert', data).then(function(response) {
                console.log(response);
                if(response.status == 200) {
                    document.location = '/#/';
                }
            });
        }

        $scope.init = function () {
            $scope.day = $stateParams.date;
            $scope.newdate = $scope.day.substring(0,4) + "-" + ($scope.day.substring(4,6)) + "-" + $scope.day.substring(6,8);
            $scope.newtimestart = "13:00";
            $scope.newtimeend = "14:00";
        };
        $scope.init();
	}
}()
);