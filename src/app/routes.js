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

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/{locale}/',
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
                templateUrl: 'component/home/home.html'
            })
            .state('app.faq', {
                url: 'faq',
                templateUrl: 'component/faq/faq.html'
            })
            .state('app.search', {
                url: 'search/{name}',
                controller: 'searchCtrl',
                templateUrl: 'component/search/search.html'
            })
            .state('app.subclass', {
                url: 'subclass/{subclass:[a-z]+}',
                controller: 'subclassCtrl',
                templateUrl: 'component/subclass/subclass.html'
            })
            .state('app.items', {
                url: 'items',
                controller: 'itemCtrl',
                templateUrl: 'component/item/item.html'
            })
            .state('app.profile', {
                url: 'profile/{platform}/{name}/{mode}',
                params: {
                    mode: { value: null, squash: true }
                },
                controller: 'profileCtrl',
                templateUrl: 'component/profile/profile.html'
            })
            .state('app.srl', {
                url: 'srl/{platform:[0-9]+}/{map:[0-9-]+}/{page:[0-9]+}',
                controller: 'srlCtrl',
                templateUrl: 'component/srl/srl.html'
            })
            .state('app.leaderboard-platform-mode-name', {
                url: 'leaderboard/{platform}/{mode}/{name}',
                controller: 'leaderboardCtrl',
                templateUrl: 'component/leaderboard/leaderboard.html'
            })
            .state('app.leaderboard-platform-mode', {
                url: 'leaderboard/{platform}/{mode}',
                controller: 'leaderboardCtrl',
                templateUrl: 'component/leaderboard/leaderboard.html'
            })
            .state('app.leaderboard-platform', {
                url: 'leaderboard/{platform}',
                controller: 'leaderboardCtrl',
                templateUrl: 'component/leaderboard/leaderboard.html'
            })
            .state('app.leaderboard', {
                url: 'leaderboard',
                controller: 'leaderboardCtrl',
                templateUrl: 'component/leaderboard/leaderboard.html'
            })
            .state('app.weapon-stats', {
                url: 'weapon-stats',
                controller: 'weaponStatsCtrl',
                templateUrl: 'component/weapon-stats/weapon-stats.html'
            });
    }
]);
