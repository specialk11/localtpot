(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('FinancesEditController', FinancesEditController);

	FinancesEditController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function FinancesEditController($scope, $http, $stateParams, UserService) {


        function setDay(date) {
            var day = date.getDate();
            if (day < 10) day = '0' + day;
            var month = date.getMonth()+1;
            if (month < 10) month = '0' + month;
            var year = date.getFullYear()
            return '' + year + month + day;
        }

        $scope.loadItem = function() {
            var userId = UserService.getUserId();
            var itemid = $scope.itemid;

            console.log(itemid);
        }

        $scope.edit = function() {
            var userId = UserService.getUserId();
            
            $scope.date = new Date($scope.day.substring(0,4), $scope.day.substring(4,6) - 1, $scope.day.substring(6,8));
            var date = setDay($scope.date);

            var weekStart = new Date()
            weekStart.setDate($scope.date.getDate() - $scope.date.getDay() + 1);
            weekStart = setDay(weekStart);

            console.log(weekStart);

            var data = {
                "userId": userId,
                "input": {
                    "weekStart": weekStart,
                    "date": date,
                    "amount": $scope.amount,
                    "details": {
                        "amount": $scope.amount,
                        "summary": $scope.details
                    }
                }
            }

            console.log(JSON.stringify(data));

            /*
            $http.post('https://tpot.space/finance/update', data).then(function(response) {
                if(response.status == 200) {
                    document.location = '/#/finances/day/' + date; //should include the date
                }
            });
            */
        }

        $scope.init = function () {
            $scope.itemid = $stateParams.itemid;

            $scope.loadItem();
        };
        $scope.init();
	}
}()
);