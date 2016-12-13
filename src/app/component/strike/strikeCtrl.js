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

        $scope.activities = [];
        $scope.activityName = '???'; // Replace with gamedata...

        $scope.platform = $stateParams.platform ? Number($stateParams.platform) : 2;
        $scope.referenceId = Number($stateParams.referenceId);
        $scope.page = $stateParams.page;
        $scope.mode = $stateParams.mode;

        $scope.loading = {
            strikes: true
        };

        $scope.platforms = consts.platforms;

        $rootScope.title = $scope.activityName + ' - Best Strike Scores - ' + $scope.platforms[$scope.platform] + ' - Guardian.gg';

        $scope.load = function(platform, mode, referenceId, page, update) {
            console.log(platform, mode, referenceId, page, update);
            if (!platform || !mode || !referenceId) {
                return;
            }


            if (update !== false) {
                var href = $state.href(
                    'app.strike',
                    {
                        platform: platform,
                        mode: mode,
                        referenceId: referenceId,
                        page: page,
                        locale: locale
                    }
                );

                $location.url(href);
            }

            return $q(function(resolve) {
                page = page ? page : 0;

                strikeApi
                    .getPage($scope.platform, $scope.mode, $scope.referenceId, page)
                    .then(function(results) {
                        $scope.results        = results.data;
                        $scope.pageCount      = results.data.pageCount;
                        $scope.pageTotal      = Math.ceil(results.data.totalItems / results.data.pageCount) - 1;
                        $scope.page           = page;
                        $scope.total          = results.data.totalItems;
                        $scope.loading.strike = false;

                        resolve();
                    });
            });
        };

        $scope.search = function(name) {
            if (name.trim().length == 0) {
                return;
            }

            strikeApi
                .search($scope.platform, $scope.mode, $scope.referenceId, name)
                .then(function (results) {
                    if (results.data.rank == 0) {
                        return;
                    }

                    $scope.highlight = name.toLowerCase();

                    $scope
                        .load($scope.platform, $scope.mode, $scope.referenceId, results.data.page, false)
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

        $scope.load($scope.platform, $scope.mode, $scope.referenceId, $scope.page, false);
    }
]);
