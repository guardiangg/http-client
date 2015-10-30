var app = angular.module('app');

app.controller('leaderboardCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$q',
    '$interval',
    '$stateParams',
    'smoothScroll',
    'leaderboardApi',
    'api',
    'consts',

    function ($rootScope, $scope, $location, $q, $interval, $stateParams, smoothScroll, leaderboardApi, api, consts) {
        $scope.page = 0;
        $scope.mode = $stateParams.mode ? Number($stateParams.mode) : 10;
        $scope.platform = $stateParams.platform ? Number($stateParams.platform) : 2;
        $scope.modes = consts.modes;
        $scope.platforms = consts.platforms;
        $scope.name = $stateParams.name ? $stateParams.name : null;
        $scope.loading = {
            leaderboard: true
        };

        $rootScope.title = $scope.modes[$scope.mode] + ' Leaderboard - ' + $scope.platforms[$scope.platform] + ' - Guardian.gg';

        $scope.load = function(platform, mode, page, update) {
            if (!platform || !mode) {
                return;
            }

            if (update !== false) {
                $location.url('/leaderboard/' + platform + '/' + mode);
            }

            return $q(function(resolve) {
                page = page ? page : 0;

                leaderboardApi
                    .getPage($scope.platform, $scope.mode, page)
                    .success(function(results) {
                        $scope.results   = results;
                        $scope.pageCount = results.page_count;
                        $scope.pageTotal = Math.ceil(results.total_items / results.page_count) - 1;
                        $scope.page      = page;
                        $scope.total     = results.total_items;
                        $scope.loading.leaderboard = false;

                        _.each($scope.results, function(entries) {
                            _.each(entries, function(entry) {
                                entry.league = consts.ratingToLeague(entry.elo);
                            });
                        });

                        resolve();
                    });
            });
        };

        $scope.profile = function(membershipId) {
            $location.url('/profile/' + $scope.platform + '/' + membershipId);
        };

        $scope.search = function(name) {
            if (name.trim().length == 0) {
                return;
            }

            leaderboardApi
                .search($scope.platform, $scope.mode, name)
                .then(function (results) {
                    if (results.data.rank == 0) {
                        return;
                    }

                    $scope.highlight = name.toLowerCase();

                    $scope
                        .load($scope.platform, $scope.mode, results.data.page, false)
                        .then(function() {
                            var count = 0;
                            var stop = $interval(function() {
                                var element = document.getElementsByClassName('highlight');

                                if (count++ == 100) {
                                    $interval.cancel(stop);
                                    return;
                                }

                                if (element.length == 0) {
                                    return;
                                }

                                smoothScroll(element[0], {
                                    offset: 200
                                });
                                $interval.cancel(stop);

                                // update url for hotlinking
                                $location.url(['/leaderboard', $scope.platform, $scope.mode, name].join('/'));
                            }, 10);
                        });
                });
        };

        if ($scope.name) {
            $scope.search($scope.name);
        } else {
            $scope.load($scope.platform, $scope.mode, 0, false);
        }
    }
]);
