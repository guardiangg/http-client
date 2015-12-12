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

    function ($rootScope, $scope, $q, $interval, leaderboardApi, api, consts, charts) {
        $scope.leaderboards = {1: {}, 2: {}};
        $scope.platforms = consts.platforms;
        $scope.modes = consts.modes;
        $scope.popularity = charts.get('popularity');
        $scope.kd = charts.get('kd');

        leaderboardApi
            .getFeatured([10,29,14,19])
            .then(function(result) {
                $scope.featured = result.data;
                _.each($scope.featured, function(platform) {
                    _.each(platform, function(mode) {
                        _.each(mode, function(player) {
                            player.league = consts.ratingToLeague(player.elo);
                        });
                    });
                });
            });

        api
            .getHomeStats()
            .then(function(result) {
                $scope.totalPlayers = result.data.total;
                $scope.totalPlayers24 = result.data.yesterday;
            });

        api
            .getSubclassTotals()
            .then(function(result) {
                var total = 0;

                _.each(result.data, function(data) {
                    total += data.playerPercent;
                });

                _.each(result.data, function(data) {
                    $scope.kd.series[0].data.push({
                        y: data.kd,
                        id: consts.subclassIdToLabel(data.subclassId),
                        name: consts.subclassIdToLabel(data.subclassId),
                        color: consts.subclassIdToColor(data.subclassId)
                    });

                    $scope.popularity.series[0].data.push({
                        y: data.playerPercent / total * 100.0,
                        id: consts.subclassIdToLabel(data.subclassId),
                        name: consts.subclassIdToLabel(data.subclassId),
                        color: consts.subclassIdToColor(data.subclassId)
                    });
                });
            });
    }
]);
