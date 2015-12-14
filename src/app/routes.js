var app = angular.module('app');

app.config([
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',

    function ($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');

        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();
            if (path[path.length - 1] === '/') {
                var newPath = path.substr(0, path.length - 1);
                $location.path(newPath).replace();
            }
        });

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/{locale}',
                params: {
                    locale: [
                        'gettextCatalog',

                        function(gettextCatalog) {
                            return gettextCatalog.getCurrentLanguage();
                        }
                    ]
                },

                // abstract states still require a template for children to populate
                template: '<ui-view/>'
            })
            .state('app.home', {
                url: '',
                controller: 'homeCtrl',
                templateUrl: 'home.html'
            })
            .state('app.faq', {
                url: '/faq',
                templateUrl: 'faq.html'
            })
            .state('app.search', {
                url: '/search/{name}',
                controller: 'searchCtrl',
                templateUrl: 'search.html'
            })
            .state('app.subclass', {
                url: '/subclass/{subclass:[a-z]+}',
                controller: 'subclassCtrl',
                templateUrl: 'subclass.html'
            })
            .state('app.itemList', {
                url: '/items/{primary:[a-z-]+}/{secondary:[a-z-]+}/{tertiary:[a-z-]+}',
                params: {
                    primary: { value: null, squash: true },
                    secondary: { value: null, squash: true },
                    tertiary: { value: null, squash: true }
                },
                controller: 'itemListCtrl',
                templateUrl: 'item.html'
            })
            .state('app.itemDetail', {
                url: '/items/{hash:[0-9]+}',
                controller: 'itemDetailCtrl',
                templateUrl: 'item-detail.html'
            })
            .state('app.itemDetailName', {
                url: '/items/{hash:[0-9]+}/{name}',
                controller: 'itemDetailCtrl',
                templateUrl: 'item-detail.html'
            })
            .state('app.profile', {
                url: '/profile/{platform}/{name}',
                controller: 'profileCtrl',
                templateUrl: 'profile.html'
            })
            .state('app.srl', {
                url: '/srl/{platform:[0-9]+}/{map:[0-9-]+}/{page:[0-9]+}',
                controller: 'srlCtrl',
                templateUrl: 'srl.html'
            })
            .state('app.leaderboard-platform-mode-name', {
                url: '/leaderboard/{platform}/{mode}/{name}',
                controller: 'leaderboardCtrl',
                templateUrl: 'leaderboard.html'
            })
            .state('app.leaderboard-platform-mode', {
                url: '/leaderboard/{platform}/{mode}',
                controller: 'leaderboardCtrl',
                templateUrl: 'leaderboard.html'
            })
            .state('app.leaderboard-platform', {
                url: '/leaderboard/{platform}',
                controller: 'leaderboardCtrl',
                templateUrl: 'leaderboard.html'
            })
            .state('app.leaderboard', {
                url: '/leaderboard',
                controller: 'leaderboardCtrl',
                templateUrl: 'leaderboard.html'
            })
            .state('app.weapon-stats', {
                url: '/weapon-stats',
                controller: 'weaponStatsCtrl',
                templateUrl: 'weapon-stats.html'
            });
    }
]);
