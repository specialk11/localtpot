(function($) {
    'use strict';
    
    angular
        .module('app')
        .controller('SocietiesController', SocietiesController);

    SocietiesController.$inject = ['$scope', '$http', '$stateParams', 'SocietiesService'];

    function SocietiesController($scope, $http, $stateParams, SocietiesService) {
        function loadEvents() {
            var college = SocietiesService.getCookie('college');
            var society = SocietiesService.getCookie('society');

            $http.get('https://tpot.space/soc/getEvents/' + college + '/' + society).then(function(response) {
                console.log(response);

                $scope.events = response.data;
            });
        }

        $scope.removeEvent = function(id) {
            var college = SocietiesService.getCookie('college');
            var email = SocietiesService.getCookie('email');
            var password = SocietiesService.getCookie('password');
            var society = SocietiesService.getCookie('society');
            
            var data = {
                "name": society,
                "id": id 
            }

            var req = {
                method: 'POST',
                url: 'https://tpot.space/soc/remove',
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
                loadEvents();
            });
        }

        $scope.init = function () {
            loadEvents();
        };
        $scope.init();
    }
}()
);