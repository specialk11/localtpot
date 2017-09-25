(function($) {
    'use strict';
    
    angular
        .module('app', ['ngRoute', 'ngCookies', 'ui.router', 'chart.js', 'ngGeolocation'])
        .controller('MainController', MainController)
        .config(config);

    config.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    function config($locationProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');  

        $stateProvider
            .state('overview', {
                url: '/',
                views: {
                    'page': { templateUrl: 'app/components/overview/overview.view.html', controller: 'OverviewController' },
                }
            })
            .state('overview/add', {
                url: '/add/:date',
                views: {
                    'page': { templateUrl: 'app/components/overview/add/overviewadd.view.html', controller: 'OverviewAddController' },
                }
            })
            .state('overview/edit', {
                url: '/edit/:date',
                views: {
                    'page': { templateUrl: 'app/components/overview/edit/overviewedit.view.html', controller: 'OverviewEditController' },
                }
            })
            .state('recipes', {
                url: '/recipes',
                views: {
                    'page': { templateUrl: 'app/components/recipes/recipes.view.html', controller: 'RecipesController' },
                }
            })
            .state('recipes/search', {
                url: '/recipes/search/:date/:meal',
                views: {
                    'page': { templateUrl: 'app/components/recipes/search/recipessearch.view.html', controller: 'RecipesSearchController' },
                }
            })
            .state('recipes/assign', {
                url: '/recipes/assign/:recipe/:date/:meal',
                views: {
                    'page': { templateUrl: 'app/components/recipes/assign/recipesassign.view.html', controller: 'RecipesAssignController' },
                }
            })
            .state('recipes/details', {
                url: '/recipes/details/:recipe',
                views: {
                    'page': { templateUrl: 'app/components/recipes/details/recipesdetails.view.html', controller: 'RecipesDetailsController' },
                }
            })
            .state('recipes/shoppinglist', {
                url: '/recipes/shoppinglist',
                views: {
                    'page': { templateUrl: 'app/components/recipes/shoppinglist/recipesshoppinglist.view.html', controller: 'RecipesShoppinglistController' },
                }
            })
            .state('recipes/specialoffers', {
                url: '/recipes/specialoffers',
                views: {
                    'page': { templateUrl: 'app/components/recipes/specialoffers/recipesspecialoffers.view.html', controller: 'RecipesSpecialoffersController' },
                }
            })
            .state('recipes/specialoffer', {
                url: '/recipes/specialoffers/:specialofferstype',
                views: {
                    'page': { templateUrl: 'app/components/recipes/specialoffer/recipesspecialoffer.view.html', controller: 'RecipesSpecialofferController' },
                }
            })
            .state('finances', {
                url: '/finances',
                views: {
                    'page': { templateUrl: 'app/components/finances/finances.view.html', controller: 'FinancesController' },
                }
            })
            .state('finances/day', {
                url: '/finances/day/:date',
                views: {
                    'page': { templateUrl: 'app/components/finances/day/financesday.view.html', controller: 'FinancesDayController' },
                }
            })
            .state('finances/add', {
                url: '/finances/add/:date/:which',
                views: {
                    'page': { templateUrl: 'app/components/finances/add/financesadd.view.html', controller: 'FinancesAddController' },
                }
            })
            .state('finances/edit', {
                url: '/finances/edit/:itemid',
                views: {
                    'page': { templateUrl: 'app/components/finances/edit/financesedit.view.html', controller: 'FinancesEditController' },
                }
            })
            .state('settings', {
                url: '/settings',
                views: {
                    'page': { templateUrl: 'app/components/settings/settings.view.html', controller: 'SettingsController' },
                }
            })
            .state('settings/addsocieties', {
                url: '/settings/addsocieties',
                views: {
                    'page': { templateUrl: 'app/components/settings/addsocieties/settingsaddsocieties.view.html', controller: 'SettingsAddsocietiesController' },
                }
            })
            .state('login', {
                url: '/login',
                views: {
                    'page': { templateUrl: 'app/components/home/login/login.view.html', controller: 'LoginController' },
                }
            })
            .state('whatistpot', {
                url: '/whatistpot',
                views: {
                    'page': { templateUrl: 'app/components/home/whatistpot/whatistpot.view.html', controller: 'WhatistpotController' },
                }
            })
            .state('welcome', {
                url: '/welcome',
                views: {
                    'page': { templateUrl: 'app/components/home/welcome/welcome.view.html', controller: 'WelcomeController' },
                }
            })
            .state('societies', {
                url: '/societies',
                views: {
                    'page': { templateUrl: 'app/components/societies/societies.view.html', controller: 'SocietiesController' },
                }
            })
            .state('societies/login', {
                url: '/societies/login',
                views: {
                    'page': { templateUrl: 'app/components/societies/login/societieslogin.view.html', controller: 'SocietiesLoginController' },
                }
            })
            .state('societies/add', {
                url: '/societies/add',
                views: {
                    'page': { templateUrl: 'app/components/societies/add/societiesadd.view.html', controller: 'SocietiesAddController' },
                }
            })
            .state('transport', {
                url: '/transport',
                views: {
                    'page': { templateUrl: 'app/components/transport/transport.view.html', controller: 'TransportController' },
                }
            });
    }
 
    MainController.$inject = ['$scope', '$location', '$rootScope', 'UserService'];

    function MainController($scope, $location, $rootScope, UserService) {
        $rootScope.$on('$locationChangeSuccess', function () {
            setTimeout(function(){ componentHandler.upgradeAllRegistered(); }, 300);
            setTimeout(function(){ componentHandler.upgradeAllRegistered(); }, 500);
            setTimeout(function(){ componentHandler.upgradeAllRegistered(); }, 700);
            console.log('$locationChangeSuccess changed!', new Date());
        });

        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            var drawer = angular.element(document.querySelector('.mdl-layout__drawer'));
            var obfuscator = angular.element(document.querySelector('.mdl-layout__obfuscator'));
            drawer.removeClass('is-visible');
            obfuscator.removeClass('is-visible');

            var state = next.split('/')[4];
            switch(state) {
                case "":
                case "add":
                case "edit":
                    $scope.tabs_overview = 'is-active';
                    $scope.tabs_recipes = '';
                    $scope.tabs_finances = '';
                    $scope.tabs_transport = '';
                    $scope.tabs = '';
                    $scope.navigation = '';
                    break;
                case "recipes":
                    $scope.tabs_recipes = 'is-active';
                    $scope.tabs_overview = '';
                    $scope.tabs_finances = '';
                    $scope.tabs_transport = '';
                    $scope.tabs = '';
                    $scope.navigation = '';
                    break;
                case "finances":
                    $scope.tabs_finances = 'is-active';
                    $scope.tabs_overview = '';
                    $scope.tabs_recipes = '';
                    $scope.tabs_transport = '';
                    $scope.tabs = '';
                    $scope.navigation = '';
                    break;
                case "transport":
                    $scope.tabs_finances = '';
                    $scope.tabs_overview = '';
                    $scope.tabs_recipes = '';
                    $scope.tabs_transport = 'is-active';
                    $scope.tabs = '';
                    $scope.navigation = '';
                    break;
                case "settings":
                    $scope.tabs = 'hidden';
                    $scope.navigation = '';
                    break;
                default:
                    $scope.tabs = 'hidden';
                    $scope.navigation = 'hidden';
            }
        });

        $rootScope.logout = function() {
            UserService.logout();
            document.location = '/#/login';
        }
    }
}()
);