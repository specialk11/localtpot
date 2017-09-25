(function($) {
    'use strict';
    
    angular
        .module('app')
        .controller('FinancesDayController', FinancesDayController);

    FinancesDayController.$inject = ['$scope', '$http', '$stateParams', 'UserService'];

    function FinancesDayController($scope, $http, $stateParams, UserService) {
        if(!UserService.isLoggedIn()) {
            document.location = '/#/login';
        }

        $scope.day = $stateParams.date;

        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
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

        function loadItems() {
            var userId = UserService.getUserId();
            var day = $scope.day;

            $http.get('https://tpot.space/finance/day/' + day + '/' + userId).then(function(response) {
                console.log(response);

                if(response.data.hasOwnProperty(day)) {
                    var tasks = response.data.college;
                    $scope.itemsmessage = '';
                    $scope.items = response.data[day];
                } else {
                    $scope.itemsmessage = 'You have no income or expenditure on this day';
                    $scope.items = [];
                }
            });
        }

        $scope.isEmpty = function (obj) {
            for (var i in obj) if (obj.hasOwnProperty(i)) return false;
            return true;
        };

        $scope.isEmptyString = function (s) {
            if(s!='') return false;
            return true;
        };

        $scope.removeItem = function(details) {
            var userId = UserService.getUserId();
            var day = $scope.day;

            var date = new Date($scope.day.substring(0,4), $scope.day.substring(4,6) - 1, $scope.day.substring(6,8));

            var weekStart = new Date();
            weekStart.setDate(date.getDate() - date.getDay() + 1);
            weekStart = setDay(weekStart);

            var data = {
                "userId": userId,
                "input": {
                    "weekStart": weekStart,
                    "date": day,
                    "details": details
                }
            }

            console.log(JSON.stringify(data));
            console.log('https://tpot.space/finance/remove');

            $http.post('https://tpot.space/finance/remove', data).then(function(response) {
                console.log(response);
                $scope.changeDate(0);
            });
        }

        $scope.changeDate = function(offset) {
            $scope.date.setDate($scope.date.getDate() + offset);
            $scope.datename = moment($scope.date.toISOString()).format("dddd Do MMMM");
            $scope.day = setDay($scope.date);
            loadItems();
        }

        $scope.init = function () {
            $scope.date = new Date($scope.day.substring(0,4), $scope.day.substring(4,6) - 1, $scope.day.substring(6,8));
            $scope.changeDate(0);
        };
        $scope.init();
    }
}()
);