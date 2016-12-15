var app = angular.module('app');

app.controller('strikeCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$state',
    '$q',
    '$interval',
    '$stateParams',
    'gettextCatalog',
    'smoothScroll',
    'strikeApi',
    'api',
    'consts',

    function ($rootScope, $scope, $location, $state, $q, $interval, $stateParams, gettextCatalog, smoothScroll, strikeApi, api, consts) {
        var locale = gettextCatalog.getCurrentLanguage();

        if ($stateParams.period != 'weekly' && $stateParams.period != 'all') {
            var href = $state.href('app.home');
            $location.url(href);
            return;
        }

        var strikeGamedata = [];

        $scope.activities = [];
        $scope.activityName = '???'; // Replace with gamedata...

        $scope.reference = false;
        $scope.period = $stateParams.period;
        $scope.platform = $stateParams.platform ? Number($stateParams.platform) : 2;
        $scope.page = $stateParams.page;
        $scope.mode = $stateParams.mode;

        $scope.loading = {
            strike: true
        };

        $scope.platforms = consts.platforms;
        $rootScope.title = 'Best Strike Scores - ' + $scope.platforms[$scope.platform] + ' - Guardian.gg';

        var updatePlatform = function() {
            console.debug('updating platform');

            $scope.strikeList = _(strikeGamedata[$scope.platform]).chain()
                .sortBy('name')
                .sortBy('instanceId')
                .value();

            _.each($scope.strikeList, function(strike, k) {
                if (consts.strikes.heroic.indexOf(strike.hash) > -1) {
                    strike.type = 'Heroic';
                    strike.sortIdx = 1;

                } else if (consts.strikes.normal.indexOf(strike.hash) > -1) {
                    strike.type = 'Normal';
                    strike.sortIdx = 2;

                } else if (strike.mode == 17) {
                    strike.type = 'Nightfall';
                    strike.sortIdx = 0;

                } else {
                    console.debug(strike.name + ': Removing, unsupported in consts');
                    $scope.strikeList.splice(k, 1);
                }
            });
        };

        $scope.load = function(period, platform, mode, reference, page, update) {
            if (!period || !platform || !mode || !reference) {
                return;
            }

            updatePlatform();

            $rootScope.title = reference.name + ' - Best Strike Scores - ' + $scope.platforms[$scope.platform] + ' - Guardian.gg';

            if (update !== false) {
                var href = $state.href(
                    'app.strike',
                    {
                        period: period,
                        platform: platform,
                        mode: mode,
                        referenceId: reference.hash,
                        page: page,
                        locale: locale
                    }
                );

                $location.url(href);
            }

            return $q(function(resolve) {
                page = page ? page : 0;

                strikeApi
                    .getPage(period, platform, mode, reference.hash, page)
                    .then(function(results) {
                        $scope.results        = results.data;
                        $scope.pageCount      = results.data.pageCount;
                        $scope.pageTotal      = Math.ceil(results.data.totalItems / results.data.pageCount) - 1;
                        $scope.page           = page;
                        $scope.total          = results.data.totalItems;
                        $scope.loading.strike = false;

                        var currentRank = 0;
                        var color = 'color-1';

                        _.each($scope.results.data, function(player) {
                            if (player.rank != currentRank) {
                                currentRank = player.rank;
                                color = color == 'color-1' ? 'color-2': 'color-1';
                            }

                            player.color = color;
                        });

                        resolve();
                    });
            });
        };

        $scope.search = function(name) {
            if (name.trim().length == 0) {
                return;
            }

            strikeApi
                .search($scope.period, $scope.platform, $scope.mode, $scope.reference.hash, name)
                .then(function (results) {
                    if (results.data.rank == 0) {
                        return;
                    }

                    $scope.highlight = name.toLowerCase();

                    $scope
                        .load($scope.period, $scope.platform, $scope.mode, $scope.reference, results.data.page, false)
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
                            }, 10);
                        });
                });
        };

        $scope.strikeList = [];

        $scope.filterTypes = function(arr) {
            arr.sort(function(a, b) {
                return a.items[0].sortIdx - b.items[0].sortIdx;
            });

            return arr;
        };

        strikeApi.getGamedata()
            .then(function(res) {
                strikeGamedata = res.data;

                $scope.reference = _.find(strikeGamedata[$scope.platform], function(strike) {
                    return strike.hash == $stateParams.referenceId;
                });

                return $scope.load(
                    $scope.period,
                    $scope.platform,
                    $scope.mode,
                    $scope.reference,
                    $scope.page,
                    false
                );
            });
    }
]);
