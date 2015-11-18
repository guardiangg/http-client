var app = angular.module('app');

app.controller('leaderboardCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$state',
    '$q',
    '$interval',
    '$stateParams',
    'gettextCatalog',
    'smoothScroll',
    'leaderboardApi',
    'api',
    'consts',

    function ($rootScope, $scope, $location, $state, $q, $interval, $stateParams, gettextCatalog, smoothScroll, leaderboardApi, api, consts) {
        var locale = gettextCatalog.getCurrentLanguage();

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
                var href = $state.href(
                    'app.leaderboard-platform-mode',
                    {
                        platform: platform,
                        mode: mode,
                        locale: locale
                    }
                );

                $location.url(href);
            }

            return $q(function(resolve) {
                page = page ? page : 0;

                leaderboardApi
                    .getPage($scope.platform, $scope.mode, page)
                    .success(function(results) {
                        $scope.results   = results;
                        $scope.pageCount = results.pageCount;
                        $scope.pageTotal = Math.ceil(results.totalItems / results.pageCount) - 1;
                        $scope.page      = page;
                        $scope.total     = results.totalItems;
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

                                var href = $state.href(
                                    'app.leaderboard-platform-mode-name',
                                    {
                                        locale: locale,
                                        platform: $scope.platform,
                                        mode: $scope.mode,
                                        name: name
                                    }
                                );

                                // update url for hotlinking
                                $location.url(href);
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
