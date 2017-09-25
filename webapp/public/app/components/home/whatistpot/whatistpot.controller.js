(function($) {
    'use strict';
    
    angular
        .module('app')
        .controller('WhatistpotController', WhatistpotController);

    WhatistpotController.$inject = ['$scope', '$http', 'UserService'];

    function WhatistpotController($scope, $http, UserService) {
    	$scope.init = function () {
            $scope.features = [
                {
                    title: "Daily Planner",
                    description: "Enim labore aliqua consequat ut quis ad occaecat aliquip incididunt. Sunt nulla eu enim irure enim nostrud aliqua consectetur ad consectetur sunt ullamco officia. Ex officia laborum et consequat duis.",
                    image: "dailyplannersmall.jpeg"
                },
                {
                    title: "Financial Planner",
                    description: "Enim labore aliqua consequat ut quis ad occaecat aliquip incididunt. Sunt nulla eu enim irure enim nostrud aliqua consectetur ad consectetur sunt ullamco officia. Ex officia laborum et consequat duis.",
                    image: "financesmall.jpeg"
                },
                {
                    title: "Recipe Planner",
                    description: "Enim labore aliqua consequat ut quis ad occaecat aliquip incididunt. Sunt nulla eu enim irure enim nostrud aliqua consectetur ad consectetur sunt ullamco officia. Ex officia laborum et consequat duis.",
                    image: "recipesmall.jpg"
                },
                {
                    title: "Travel Planner",
                    description: "Enim labore aliqua consequat ut quis ad occaecat aliquip incididunt. Sunt nulla eu enim irure enim nostrud aliqua consectetur ad consectetur sunt ullamco officia. Ex officia laborum et consequat duis.",
                    image: "travelsmall.jpeg"
                }
            ];
        };
        $scope.init();
    }
}()
);