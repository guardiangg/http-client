var app = angular.module('app');

app.controller('homeCtrl', [
    '$rootScope',
    '$scope',
    '$q',
    '$interval',
    'leaderboardApi',
    'api',
    'consts',
    'charts',
    'gettextCatalog',

    function ($rootScope, $scope, $q, $interval, leaderboardApi, api, consts, charts, gettextCatalog) {
        $scope.leaderboards = {1: {}, 2: {}};
        $scope.platforms = consts.platforms;
        $scope.modes = consts.modes;
        $scope.popularity = charts.get('popularity');
        $scope.kd = charts.get('kd');
        $rootScope.title = gettextCatalog.getString(
            'Guardian.gg - Advanced Destiny Stats, Profiles, Leaderboards, and Database'
        );

        var gameModes = [14, 19, 10, 13, 24, 12, 11, 15, 23, 9];
        leaderboardApi
            .getFeatured(gameModes)
            .then(function(result) {
                $scope.featured = result.data;
                _.each($scope.featured, function(platform, k) {
                    _.each(platform, function(mode) {
                        _.each(mode, function(player) {
                            player.league = consts.ratingToLeague(player.elo);
                        });
                    });

                    var map = [];
                    _.each(platform, function(obj, k) {
                        if (obj.length > 0) {
                            map[_.indexOf(gameModes, parseInt(k))] = {
                                mode: k,
                                players: obj
                            };
                        }
                    });

                    $scope.featured[k] = map;
                });
            });

        api
            .getHomeStats()
            .then(function(result) {
                $scope.totalPlayers = result.data.total;
                $scope.totalPlayers24 = result.data.yesterday;
            });
    }
]);
