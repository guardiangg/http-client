var app = angular.module('app');

app.controller('weaponStatsCtrl', [
    '$scope',
    'api',
    'charts',
    'consts',
    'datastore',
    'gamedata',

    function ($scope, api, charts, consts, datastore, gamedata) {
        $scope.modes = consts.modes;
        $scope.modeItems = Object.keys(consts.modes);
        $scope.modeIcons = consts.modeIcons;

        $scope.queuedUpdateProgress = 100;

        $scope.activity = {};
        $scope.classBalance = [];
        $scope.winRatios = [];

        $scope.weaponsLoading = true;
        $scope.isPvp = true;

        $scope.lastMonth = moment().subtract(30, 'days').format('YYYY-MM-DD');
        $scope.lastWeek = moment().subtract(6, 'days').format('YYYY-MM-DD');
        $scope.yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
        $scope.today = moment().format('YYYY-MM-DD');

        $scope.filters = angular.extend({
            platform: 2,
            start: $scope.lastMonth,
            end: $scope.yesterday,
            mode: 10,
            activity: null
        }, datastore.getParamsFromHash());

        $scope.loadingActivities = false;

        $scope.getActivitiesForMode = function(item) {
            $scope.loadingActivities = true;
            datastore.setParams($scope.filters);

            gamedata
                .get('activities')
                .then(function(result) {
                    var activities = [];

                    _.forEach(result, function(activity) {
                        if (activity.typeHash != 3695721985) {
                            return;
                        }
                        activities.push(activity);
                    });

                    $scope.activities = activities;
                    $scope.loadingActivities = false;
                });
        };

        /*if ($scope.filters.mode != null) {
            for (var i in $scope.modes) {
                if ($scope.modes[i].id == $scope.filters.mode) {
                    $scope.mode.selected = $scope.modes[i];
                    $scope.getActivitiesForMode();
                    break;
                }
            }
        }*/

        /*$scope.$watch('activity', function(activity) {
            if (activity.selected && activity.selected.id) {
                $scope.filters.activity = activity.selected.id;
            } else if (activity.selected && !activity.selected.id) {
                $scope.filters.activity = null;
            }
        }, true);

        $scope.$watch('mode', function(mode) {
            $scope.activity = {};
            $scope.filters.activity = null;

            if (mode.selected && mode.selected.id) {
                $scope.filters.mode = mode.selected.id;
            } else if (mode.selected && !mode.selected.id) {
                $scope.filters.mode = null;
            }
        }, true);*/

        $scope.update = function() {
            if ($scope.queuedUpdateProgress < 100 || !$scope.filters.mode || !$scope.filters.start || !$scope.filters.end) {
                return;
            }

            $scope.queuedUpdateProgress = 0;
            $scope.weaponsLoading = true;

            datastore.setParams($scope.filters);

            api
                .getWeaponTypes()
                .then(function(data) {
                    $scope.updateWeaponTypes(data);
                    $scope.queuedUpdateProgress += 50;
                });

            api
                .getWeapons()
                .then(function(data) {
                    $scope.updateWeapons(data);
                    $scope.queuedUpdateProgress += 50;
                    $scope.weaponsLoading = false;
                });
        };

        $scope.updateWeapons = function(data) {
            $scope.weapons = {
                primary: [],
                special: [],
                heavy: []
            };

            for (var i in data) {
                var weapon = data[i];
                if (weapon.typeBucket == 'Primary Weapons') {
                    $scope.weapons.primary.push(weapon);
                } else if (weapon.typeBucket == 'Special Weapons') {
                    $scope.weapons.special.push(weapon);
                } else if (weapon.typeBucket == 'Heavy Weapons') {
                    $scope.weapons.heavy.push(weapon);
                }
            }
        };

        $scope.updateWeaponTypes = function(data) {
            var dateStart = new Date($scope.filters.start);
            dateStart.setTime( dateStart.getTime() + dateStart.getTimezoneOffset()*60*1000 );
            var dateEnd = new Date($scope.filters.end);
            dateEnd.setTime( dateEnd.getTime() + dateEnd.getTimezoneOffset()*60*1000 );

            var types = {};
            var dailyData = [];

            for (var i in data) {
                if (!types[data[i].typeId]) {
                    types[data[i].typeId] = data[i];
                }

                if (!dailyData[data[i].day]) {
                    dailyData[data[i].day] = [];
                }

                dailyData[data[i].day][data[i].typeId] = Math.floor(data[i].kills * 1000) / 1000;
            }

            var series;
            // Bar chart (single day)
            if (dateStart.getTime() == dateEnd.getTime()) {
                $scope.weaponTypeConfig = weaponTypeConfigBar;

                var seriesData = {
                    name: "Weapon Types",
                    colorByPoint: true,
                    data: []
                };

                var day = new Date(dateStart);
                var format = moment(day).format('YYYY-MM-DD');

                for (var id in types) {
                    // hack an affix to differentiate identically named types
                    var extra = '';
                    if (id == 102 || id == 67 || id == 95) {
                        extra = ' (Primary)';
                    }

                    seriesData.data.push({
                        name: types[id].typeName + extra,
                        y: dailyData[format][id] ? dailyData[format][id] : 0,
                        drilldown: types[id].typeName + extra
                    });
                }

                seriesData.data.sort(function(a, b) {
                    return a.y > b.y ? -1 : 1
                });

                series = [seriesData];

                // Spline chart (multi-day)
            } else {
                $scope.weaponTypeConfig = charts.get('weapon-spline');
                $scope.weaponTypeConfig.options.plotOptions.spline.pointStart = Date.UTC(
                    dateStart.getUTCFullYear(),
                    dateStart.getUTCMonth(),
                    dateStart.getUTCDate(),
                    0, 0, 0
                );

                series = {};
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {
                    var day = new Date(d);
                    var format = moment(day).format('YYYY-MM-DD');

                    for (var id in types) {
                        if (!series[id]) {
                            // hack an affix to differentiate identically named types
                            var extra = '';
                            if (id == 102 || id == 67 || id == 95) {
                                extra = ' (Primary)';
                            }

                            series[id] = { data: [], name: types[id].typeName + extra };
                        }

                        if (dailyData[format] && dailyData[format][id]) {
                            series[id].data.push(dailyData[format][id]);
                        } else {
                            series[id].data.push(0);
                        }
                    }
                }
            }

            $scope.weaponTypeConfig.series = series;
        };

        $scope.weaponTypeConfig = charts.get('weapon-spline');

        if ($scope.filters.mode != null) {
            $scope.update();
        }
    }
]);