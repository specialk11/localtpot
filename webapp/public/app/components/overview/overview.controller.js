(function($) {
    'use strict';
    
    angular
        .module('app')
        .controller('OverviewController', OverviewController)
        .directive('tasks', tasks);

    OverviewController.$inject = ['$scope', '$http', 'UserService'];

    function OverviewController($scope, $http, UserService) {
        if(!UserService.isLoggedIn()) {
            document.location = '/#/login';
        }

        $scope.time = new Date().getHours();
        $scope.date = new Date();

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

        function loadTasks() {
            var userId = UserService.getUserId();
            
            $scope.day = setDay($scope.date);
            var date = $scope.day;

            var calendars = $scope.calendars;

            // output user id and date
            console.log('https://tpot.space/college/' + userId + '/' + date);
            $http.get('https://tpot.space/college/' + userId + '/' + date).then(function(response) {
                console.log(response);
                var collegetasks = response.data.college;
                $scope.tasksmessage = '';
                $scope.tasks = sortByKey(collegetasks,'timeMin');

                console.log('https://tpot.space/tasks/day/' + userId + '/' + date);
                $http.get('https://tpot.space/tasks/day/' + userId + '/' + date).then(function(response) {
                    console.log(response);
                    var tasks = response.data.eventData;
                    tasks = tasks.concat(collegetasks);
                    $scope.tasks = sortByKey(tasks,'timeMin');
                    console.log($scope.tasks);
                });
            });
        }

        $scope.removeTask = function(id) {
            var userId = UserService.getUserId();
            var day = $scope.day;
            console.log(data);
            var date = new Date($scope.day.substring(0,4), $scope.day.substring(4,6) - 1, $scope.day.substring(6,8));

            var weekStart = new Date();
            weekStart.setDate(date.getDate() - date.getDay() + 1);
            weekStart = setDay(weekStart);

            var data = {
                "userId": userId,
                "calendarId": "primary",
                "eventId": id
            }

            console.log(data);

            $http.post('https://tpot.space/tasks/remove', data).then(function(response) {
                console.log(response);
                $scope.changeDate(0);
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

        $scope.changeDate = function(offset) {
            $scope.date.setDate($scope.date.getDate() + offset);
            $scope.day = setDay($scope.date);
            if($scope.date.getDate() == new Date().getDate() && $scope.date.getMonth() == new Date().getMonth()) {
                $scope.datename = 'Today';
            } else {
                $scope.datename = moment($scope.date.toISOString()).format("dddd Do MMMM");
            }
            loadTasks();
        }

        $scope.init = function () {
            var userId = UserService.getUserId();

            $scope.changeDate(0);
        };
        $scope.init();
    }

    tasks.$inject = ['$http', 'UserService'];

    function tasks($http, UserService) {
        return {
            require: 'ngModel',
            templateUrl: 'app/components/overview/task.template.html',
            link: function($scope, element, attrs) {
                $scope.time = new Date().getHours();

                $scope.getTaskTitle = function(title) {
                    return title.replace('&amp;','&');
                };

                $scope.getColor = function(color) {
                    switch(color) {
                        case '#ffeecc':
                            return '#FCFFD8';
                        case '#ffcccc':
                            return '#FDF2EF';
                        case '#cceeff':
                            return '#DCE5F3';
                        case '#a569bd':
                            return '#FEECCD';
                    }
                };

                $scope.getHour = function(dateTime) {
                    var date = new Date(dateTime);
                    var time = date.getHours();
                    if(time < 10) {
                        time = '0' + time;
                    }
                    time = '' + time + ':00';
                    return time;
                };

                $scope.taskComplete = function(id) {
                    var userId = UserService.getUserId();
                    var task = {
                        "id": id,
                        "completed": 1
                    }
                    $http.post('https://tpot.space/tasks/update', task).then(function(response) {
                        console.log(response);
                    });
                };
            }
        };
    }
}()
);