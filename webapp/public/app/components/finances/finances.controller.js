(function($) {
    'use strict';
    
    angular
	    .module('app')
	    .controller('FinancesController', FinancesController);

	FinancesController.$inject = ['$scope', '$http', 'UserService'];

	function FinancesController($scope, $http, UserService) {
		if(!UserService.isLoggedIn()) {
	        document.location = '/#/login';
	    }

	    function loadWeek() {
            var userId = UserService.getUserId();
            var mondayday = $scope.mondayday;

            $http.get('https://tpot.space/finance/week/' + mondayday + '/' + userId).then(function(response) {
            	console.log(response);
            	$scope.income = response.data[mondayday].income;
            	$scope.expenditure = response.data[mondayday].expenditure;
            	$scope.balance = response.data[mondayday].total;
            });
        }
	    
	    function setDay(date) {
            var day = date.getDate();
            if (day < 10) day = '0' + day;
            var month = date.getMonth()+1;
            if (month < 10) month = '0' + month;
            var year = date.getFullYear()
            return '' + year + month + day;
        }

        $scope.viewDay = function() {
            var day = $scope.day;

            window.location = '/#/finances/day/' + day;
        }

        $scope.changeDate = function(offset) {
        	console.log(offset);
        	console.log($scope.date);
            $scope.date.setDate($scope.date.getDate() + offset);
            console.log($scope.date);
            $scope.day = setDay($scope.date);

            var date = $scope.date;
            var monday = date.getDate() - date.getDay() + 1;
            var sunday = monday + 6;
            var tempdate = new Date();
            var mondaydate = new Date(tempdate.setDate(monday));
            var monday = moment(mondaydate.toISOString()).format("Do");
            var sundaydate = new Date(tempdate.setDate(sunday));
			var sunday = moment(sundaydate.toISOString()).format("Do MMMM");
			$scope.datename = 'Week ' + monday + ' - ' + sunday;

            $scope.mondayday = setDay(mondaydate);

            loadWeek();
            $scope.loadChart();
        };

        $scope.loadChart = function() {
            var userId = UserService.getUserId();

            var income = [];
            var expenditure = [];
            var balance = []

            var currentdate = $scope.date;
            currentdate.setDate(currentdate.getDate() - currentdate.getDay() + 1);
            var currentday = setDay(currentdate);
            var currentbalance = 0;

            $http.get('https://tpot.space/finance/day/' + currentday + '/' + userId).then(function(response) {
                var items = response.data;
                var lastbalance = 0;

                for(var i=0; i<7; i++) {
                    var currentincome = 0;
                    var currentexpenditure = 0;
                    var currentbalance = lastbalance;

                    if (typeof items[currentday] != "undefined") {
                        for(var item in items[currentday]) {
                            var currentamount = parseInt(items[currentday][item].amount);
                            if(currentamount * 1 == currentamount) {
                                if(currentamount < 0) {
                                    currentexpenditure += currentamount;
                                } else {
                                    currentincome += currentamount
                                }
                                currentbalance = currentbalance + currentamount;
                            }
                        }
                    }

                    console.log(currentbalance);

                    income.push(currentincome);
                    expenditure.push(currentexpenditure);
                    balance.push(currentbalance);

                    lastbalance = currentbalance;

                    currentdate.setDate(currentdate.getDate() + 1);
                    currentday = setDay(currentdate);
                }

                console.log(income);
                console.log(expenditure);
                console.log(balance);

                $scope.labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                $scope.series = ['Income', 'Expenditure', 'Balance'];
                $scope.data = [
                    income,
                    expenditure,
                    balance
                ];
                $scope.onClick = function (points, evt) {
                    console.log(points, evt);
                };
                //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }, { yAxisID: 'y-axis-3' }];
                $scope.options = {
                    scales: {
                        yAxes: [
                            {
                                id: 'y-axis-1',
                                type: 'linear',
                                display: true,
                                position: 'left'
                            }
                        ]
                    }
                };
            });
        }

	    $scope.init = function () {
            $scope.date = new Date();
            $scope.date.setDate($scope.date.getDate() - $scope.date.getDay() + 1);
            console.log($scope.date);
            $scope.day = setDay($scope.date);
            $scope.changeDate(0);
            console.log($scope.date);
            $scope.loadChart();
        };
        $scope.init();
	}
}()
);