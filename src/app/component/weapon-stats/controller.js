var app = angular.module('app');

app.controller('weaponStatsCtrl', [
    '$scope',
    '$location',
    'api',
    'charts',
    'consts',
    'gettext',

    function ($scope, $location, api, charts, consts, gettext) {
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
            activity: ''
        }, $location.search());

        $scope.loadingActivities = false;

        $scope.getActivitiesForMode = function(mode) {
            $scope.loadingActivities = true;
            $scope.filters.activity = '';

            api
                .getWeaponActivities(mode)
                .then(function(result) {
                    result.data.unshift({
                        name: '- ' + gettext('Any Map') + ' -',
                        icon: null,
                        hash: ''
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

            api
                .getTopWeapons()
                .then(function(result) {
                    $scope.totals = {};
                    $scope.weapons = result.data;

                    // calculate total kills for each type
                    _.each(['primary', 'special', 'heavy'], function(type) {
                        $scope.totals[type] = _.reduce($scope.weapons[type], function(total, weapon) {
                            return total + weapon.kills;
                        }, 0);
                    });

                    $scope.queuedUpdateProgress += 50;

                    return api.getTopWeaponTypes();
                })
                .then(function(result) {
                    $scope.updateWeaponTypes(result.data);

                    $scope.queuedUpdateProgress += 50;
                    $scope.weaponsLoading = false;
                });
        };

        $scope.updateWeaponTypes = function(data) {
            // calculate total kills for each day
            var kills = {};
            _.each(data, function(typeData) {
                _.each(typeData, function(row) {
                    if (!kills[row.day]) {
                        kills[row.day] = 0;
                    }
                    kills[row.day] += row.kills;
                })
            });

            var series;
            if ($scope.filters.start == $scope.filters.end) {
            } else {
                $scope.weaponTypeConfig = charts.get('weapon-spline');

                series = {};

                _.each(data, function(typeData, typeName) {
                    series[typeName] = {
                        data: [],
                        name: typeName
                    };

                    _.each(_.sortBy(typeData, 'day'), function(row) {
                        series[typeName].data.push({
                            x: +new Date(row.day),
                            y: row.kills / kills[row.day] * 100
                        });
                    });
                });
            }

            $scope.weaponTypeConfig.series = series;
        };

        if ($scope.filters.mode != null) {
            $scope.getActivitiesForMode($scope.filters.mode);
        }

        if ($scope.filters.mode != null) {
            $scope.update();
        }
    }
]);