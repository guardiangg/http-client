var app = angular.module('app');

app.config([
    '$locationProvider',
    '$stateProvider',
    'gettext',

    function ($locationProvider, $stateProvider, gettext) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/{locale:en|fr|es|de|it|ja|pt-br}',

                // abstract states still require a template for children to populate
                template: '<ui-view/>'
            })
            .state('app.home', {
                url: '/',
                controller: 'homeCtrl',
                templateUrl: 'app/view/home.html'
            })
            .state('app.faq', {
                url: '/faq',
                title: gettext('Frequently Asked Questions'),
                templateUrl: 'app/view/faq.html'
            })
            .state('app.search', {
                url: '/search/{name}',
                controller: 'searchCtrl',
                templateUrl: 'app/view/search.html'
            })
            .state('app.subclass', {
                url: '/subclass/{subclass:[a-z]+}',
                controller: 'subclassCtrl',
                templateUrl: 'app/view/subclass.html'
            })
            .state('app.profile', {
                url: '/profile/{platform}/{name}',
                controller: 'profileCtrl',
                templateUrl: 'app/view/profile.html'
            })
            .state('app.leaderboard-platform-mode-name', {
                url: '/leaderboard/{platform}/{mode}/{name}',
                controller: 'leaderboardCtrl',
                templateUrl: 'app/view/leaderboard.html'
            })
            .state('app.leaderboard-platform-mode', {
                url: '/leaderboard/{platform}/{mode}',
                controller: 'leaderboardCtrl',
                templateUrl: 'app/view/leaderboard.html'
            })
            .state('app.leaderboard-platform', {
                url: '/leaderboard/{platform}',
                controller: 'leaderboardCtrl',
                templateUrl: 'app/view/leaderboard.html'
            })
            .state('app.leaderboard', {
                url: '/leaderboard',
                controller: 'leaderboardCtrl',
                templateUrl: 'app/view/leaderboard.html'
            })
            .state('app.weapon-stats', {
                url: '/weapon-stats',
                controller: 'weaponStatsCtrl',
                templateUrl: 'app/view/weapon-stats.html'
            });
    }
]);
