var app = angular.module('app');

app.controller('srlCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$state',
    '$q',
    '$interval',
    '$stateParams',
    'gettextCatalog',
    'smoothScroll',
    'srlApi',
    'api',
    'consts',

    function ($rootScope, $scope, $location, $state, $q, $interval, $stateParams, gettextCatalog, smoothScroll, srlApi, api, consts) {
        var locale = gettextCatalog.getCurrentLanguage();

        $scope.mapName = consts.srl_maps[$stateParams.map];
        if (!$scope.mapName) {
            var href = $state.href('app.home');
            $location.url(href);
            return;
        }

        $scope.platform = $stateParams.platform ? Number($stateParams.platform) : 2;
        $scope.map = Number($stateParams.map);
        $scope.page = 0;
        $scope.loading = {
            srl: true
        };

        $scope.maps = consts.srl_maps;
        $scope.platforms = consts.platforms;

        $rootScope.title = $scope.mapName + ' - Best SRL Times - ' + $scope.platforms[$scope.platform] + ' - Guardian.gg';

        $scope.load = function(platform, map, page, update) {
            if (!platform || !map) {
                return;
            }

            if (update !== false) {
                var href = $state.href(
                    'app.srl',
                    {
                        platform: platform,
                        map: map,
                        locale: locale
                    }
                );

                $location.url(href);
            }

            return $q(function(resolve) {
                page = page ? page : 0;

                srlApi
                    .getPage($scope.platform, $scope.map, page)
                    .success(function(results) {
                        $scope.results   = results;
                        $scope.pageCount = results.pageCount;
                        $scope.pageTotal = Math.ceil(results.totalItems / results.pageCount) - 1;
                        $scope.page      = page;
                        $scope.total     = results.totalItems;
                        $scope.loading.srl = false;

                        resolve();
                    });
            });
        };

        $scope.search = function(name) {
            if (name.trim().length == 0) {
                return;
            }

            srlApi
                .search($scope.platform, $scope.map, name)
                .then(function (results) {
                    if (results.data.rank == 0) {
                        return;
                    }

                    $scope.highlight = name.toLowerCase();

                    $scope
                        .load($scope.platform, $scope.map, results.data.page, false)
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

        $scope.load($scope.platform, $scope.map, 0, false);
    }
]);
