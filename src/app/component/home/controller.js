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
            .getFeatured([10,13,19,24])
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

        var halt = false;
        var stop = false;

        var refreshFirsts = function() {
            // hard-mode ?????
            // normal-mode (testing) 1733556769
            // mock empty 5466544564
            api
                .getHomeWorldFirsts('3534581229')
                .then(function(result) {
                    var raids = [];

                    for (var i in result.data) {
                        var row = result.data[i];
                        var instanceId = row.instanceId;

                        var instance = _.find(raids, function(raid) {
                            return raid.instanceId == instanceId;
                        });

                        if (!instance) {
                            var unix = moment(row.endedAt).unix();

                            instance = {
                                instanceId: instanceId,
                                completionUnix: unix,
                                completionFormatted: moment.unix(unix).format('MMM Do, h:mm:ssa'),
                                members: []
                            };

                            raids.push(instance);
                        }

                        instance.members.push(row);
                    }

                    raids = _.sortBy(raids, 'completionUnix').slice(0, 5);

                    if (raids.length == 5) {
                        halt = true;
                    }

                    var emptySlots = 5 - raids.length;
                    if (emptySlots > 0) {
                        for (var i = 0; i < emptySlots; i++) {
                            raids.push({
                                empty: true
                            });
                        }
                    }

                    $scope.worldFirst = raids;
                });

            if (!stop) {
                stop = $interval(refreshFirsts, 15000);
            }

            if (halt) {
                $interval.cancel(stop);
            }
        };

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

                _.each(result, function(data) {
                    total += data.playerPercent;
                });

                _.each(result, function(data) {
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

        refreshFirsts();
    }
]);
