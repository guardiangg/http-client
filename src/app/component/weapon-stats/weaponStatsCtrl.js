var app = angular.module('app');

app.controller('weaponStatsCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'charts',
    'consts',
    'gettext',
    'weaponStats',

    function ($rootScope, $scope, $location, charts, consts, gettext, weaponStats) {
        $rootScope.title = 'Best Crucible Weapons - Guardian.gg';

        $scope.modes = consts.modes;
        $scope.modeItems = Object.keys(consts.modes);
        $scope.modeIcons = consts.modeIcons;

        $scope.queuedUpdateProgress = 100;

        $scope.weaponsLoading = true;

        $scope.today = moment().format('YYYY-MM-DD');

        $scope.filters = angular.extend({
            platform: 2,
            start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            end: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            mode: 10,
            activity: 0
        }, $location.search());

        $scope.loadingActivities = false;

        $scope.getActivities = function() {
            $scope.loadingActivities = true;
            $scope.filters.activity = 0;

            weaponStats
                .getActivities()
                .then(function(result) {
                    result.data.unshift({
                        name: '- ' + gettext('Any Map') + ' -',
                        icon: null,
                        hash: 0
                    });

                    $scope.activities = result.data;
                    $scope.loadingActivities = false;
                });
        };

        $scope.update = function() {
            if ($scope.queuedUpdateProgress < 100) {
                return;
            }

            $location.search($scope.filters);

            $scope.queuedUpdateProgress = 0;
            $scope.weaponsLoading = true;

            weaponStats
                .loadWeapons()
                .then(function(result) {
                    $scope.weapons = result.weapons;
                    $scope.weaponsLoading = false;

                    var series = {};
                    if ($scope.filters.start == $scope.filters.end) {
                        $scope.weaponTypeConfig = charts.get('weapon-bar');

                        var seriesData = {
                            name: "Weapon Types",
                            colorByPoint: true,
                            data: []
                        };

                        _.each(result.weaponTypes, function(typeData, typeName) {
                            seriesData.data.push({
                                name: typeName,
                                y: Math.round(typeData[0].kills * 100) / 100
                            });
                        });

                        series = [seriesData];
                    } else {
                        $scope.weaponTypeConfig = charts.get('weapon-spline');

                        _.each(result.weaponTypes, function(typeData, typeName) {
                            series[typeName] = {
                                data: [],
                                name: typeName
                            };

                            _.each(_.sortBy(typeData, 'day'), function(row) {
                                series[typeName].data.push({
                                    x: +new Date(row.day),
                                    y: Math.round(row.kills * 100) / 100
                                });
                            });
                        });
                    }

                    $scope.weaponTypeConfig.series = series;
                }, function() {
                    // handle?
                }, function(value) {
                    $scope.queuedUpdateProgress += value;
                });
        };

        if ($scope.filters.mode != null) {
            $scope.getActivities();
        }

        if ($scope.filters.mode != null) {
            $scope.update();
        }
    }
]);