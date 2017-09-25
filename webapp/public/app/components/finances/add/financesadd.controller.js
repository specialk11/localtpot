(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('FinancesAddController', FinancesAddController);

	FinancesAddController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

	function FinancesAddController($scope, $http, $stateParams, UserService) {
        function setDay(date) {
            var day = date.getDate();
            if (day < 10) day = '0' + day;
            var month = date.getMonth()+1;
            if (month < 10) month = '0' + month;
            var year = date.getFullYear()
            return '' + year + month + day;
        }

        $scope.add = function() {
            var userId = UserService.getUserId();
            
            $scope.date = new Date($scope.day.substring(0,4), $scope.day.substring(4,6) - 1, $scope.day.substring(6,8));
            var date = setDay($scope.date);

            var weekStart = new Date()
            weekStart.setDate($scope.date.getDate() - $scope.date.getDay() + 1);
            weekStart = setDay(weekStart);

            console.log(weekStart);

            if($scope.which == "Expenditure") {
                $scope.amount = $scope.amount * -1;
            }

            var data = {
                "userId": userId,
                "input": {
                    "weekStart": weekStart,
                    "date": date,
                    "details": {
                        "amount": $scope.amount,
                        "summary": $scope.details
                    }
                }
            }

            console.log(JSON.stringify(data));

            $http.post('https://tpot.space/finance/insert', data).then(function(response) {
                if(response.status == 200) {
                    document.location = '/#/finances/day/' + date;
                }
            });
        }

        $scope.init = function () {
            $scope.day = $stateParams.date;
            $scope.which = $stateParams.which;
            $scope.which = $scope.which.charAt(0).toUpperCase() + $scope.which.slice(1);
        };
        $scope.init();
	}
}()
);