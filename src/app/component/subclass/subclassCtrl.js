var app = angular.module('app');

app.controller('subclassCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$localStorage',
    '$filter',
    'api',
    'consts',
    'charts',

    function ($rootScope, $scope, $stateParams, $localStorage, $filter, api, consts, charts) {
        var subclassId = consts.subclassToId($stateParams.subclass);
        $scope.subclass = consts.subclasses[subclassId];

        $rootScope.title = $scope.subclass.label + ' - Subclass Item/Perk Analysis - Guardian.gg';

        $scope.mode = $localStorage.modeSubclass;
        if (!$scope.mode) {
            $scope.mode = 10;
        }

        $scope.loading = {
            charts: true,
            perks: true,
            weapons: true,
            armor: true
        };

        $scope.colNames = {
            1: 'Grenade',
            2: 'Jump',
            3: 'Super',
            4: 'Melee',
            5: 'Stats #1',
            6: 'Special #1',
            7: 'Stats #2',
            8: 'Special #2'
        };

        $scope.perkTotal = 0;
        $scope.exoticTotal = 0;

        $scope.subclassKd = charts.get('subclass-kd');
        $scope.subclassWinRate = charts.get('subclass-win-rate');

        var prepareExoticList = function (list) {
            list = _.filter(list, function (item) {
                return item.total > 150;
            });

            _.each(list, function (item) {
                item.kd = item.deaths > 0 ? item.kills / item.deaths : item.kills;
            });

            list = _.sortBy(list, 'kd').reverse();

            return list;
        };

        var loadSubclassCharts = function () {
            $scope.loading.charts = true;

            api
                .getSubclassDetails($stateParams.subclass)
                .then(function (result) {
                    _.each(result.data, function (data) {
                        $scope.subclassKd.series[0].data.push({
                            y: data.kills / data.deaths,
                            name: consts.modes[data.mode]
                        });

                        $scope.subclassWinRate.series[0].data.push({
                            y: data.wins / data.total * 100,
                            name: consts.modes[data.mode]
                        })
                    });

                    $scope.loading.charts = false;
                });
        };

        var loadSubclassPerks = function () {
            $scope.loading.perks = true;
            $scope.loading.weapons = true;
            $scope.loading.armor = true;

            api
                .getSubclassPerks({
                    subclassId: subclassId,
                    mode: $scope.mode,
                    start: moment().weekday(-7).format('YYYY-MM-DD'),
                    end: moment().format('YYYY-MM-DD')
                })
                .then(function (result) {
                    var filtered = [],
                        totals = {};

                    _.each(result.data, function (group) {
                        _.each(group, function (row) {
                            if (!filtered[row.col]) {
                                filtered[row.col] = {};
                            }

                            var item = {
                                name: row.name,
                                description: row.description,
                                icon: row.icon,
                                row: row.row,
                                total: row.total,
                                deaths: row.deaths,
                                kills: row.kills,
                                wins: row.wins,
                                kd: row.deaths > 0 ? row.kills / row.deaths : row.kills
                            };

                            if (filtered[row.col][row.nodeIndex]) {
                                filtered[row.col][row.nodeIndex].total += row.total;
                                filtered[row.col][row.nodeIndex].kills += row.kills;
                                filtered[row.col][row.nodeIndex].deaths += row.deaths;
                                filtered[row.col][row.nodeIndex].wins += row.wins;
                                filtered[row.col][row.nodeIndex].kd = filtered[row.col][row.nodeIndex].deaths > 0 ?
                                filtered[row.col][row.nodeIndex].kills / filtered[row.col][row.nodeIndex].deaths :
                                    filtered[row.col][row.nodeIndex].kills;
                            } else {
                                filtered[row.col][row.nodeIndex] = item;
                            }

                            if (!totals[row.col]) {
                                totals[row.col] = 0;
                            }

                            totals[row.col] += row.total
                        });
                    });

                    $scope.perks = filtered;
                    $scope.perkTotals = totals;
                    $scope.loading.perks = false;
                });

            api
                .getSubclassExotics({
                    subclassId: subclassId,
                    mode: $scope.mode,
                    start: moment().weekday(-7).format('YYYY-MM-DD'),
                    end: moment().format('YYYY-MM-DD')
                })
                .then(function (result) {
                    var weapons = {},
                        armors = {},
                        totals = {
                            weapons: 0,
                            armor: 0
                        };

                    _.each(result.data, function (group) {
                        _.each(group, function (row) {
                            var weapon = [consts.buckets.special, consts.buckets.primary, consts.buckets.heavy];
                            var armor = [consts.buckets.head, consts.buckets.arm, consts.buckets.chest, consts.buckets.leg];

                            var item = {
                                name: row.itemName,
                                icon: row.itemIcon,
                                total: row.total,
                                deaths: row.deaths,
                                kills: row.kills,
                                wins: row.wins
                            };

                            if (weapon.indexOf(row.bucketHash) > -1) {
                                if (weapons[row.itemHash]) {
                                    weapons[row.itemHash].total += row.total;
                                    weapons[row.itemHash].kills += row.kills;
                                    weapons[row.itemHash].deaths += row.deaths;
                                    weapons[row.itemHash].wins += row.wins;
                                } else {
                                    weapons[row.itemHash] = item;
                                }

                                totals.weapons += row.total;
                            } else if (armor.indexOf(row.bucketHash) > -1) {
                                if (armors[row.itemHash]) {
                                    armors[row.itemHash].total += row.total;
                                    armors[row.itemHash].kills += row.kills;
                                    armors[row.itemHash].deaths += row.deaths;
                                    armors[row.itemHash].wins += row.wins;
                                } else {
                                    armors[row.itemHash] = item;
                                }

                                totals.armor += row.total;
                            }
                        });
                    });

                    $scope.weapons = prepareExoticList(weapons);
                    $scope.armors = prepareExoticList(armors);
                    $scope.loading.weapons = false;
                    $scope.loading.armor = false;
                    $scope.totals = totals;
    
                    $scope.weapons = prepareExoticList(weapons);
                    $scope.armors = prepareExoticList(armors);
                    $scope.loading.weapons = false;
                    $scope.loading.armor = false;
                    $scope.totals = totals;
                });
        };

        $scope.nodeFilter = function (a) {
            var node = $scope.perkData[a];

            if (!node) {
                return -9999;
            }

            return node.col;
        };

        $scope.setMode = function (mode, force) {
            if ($scope.mode == mode && !force) {
                return;
            }

            $scope.mode = mode;
            $localStorage.modeSubclass = mode;

            loadSubclassPerks();
        };

        loadSubclassCharts();
        loadSubclassPerks();
    }
]);
