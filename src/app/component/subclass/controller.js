var app = angular.module('app');

app.controller('subclassCtrl', [
    '$scope',
    '$stateParams',
    '$filter',
    'api',
    'consts',
    'charts',
    'gamedata',

    function ($scope, $stateParams, $filter, api, consts, charts, gamedata) {
        $scope.colNames = {
            1: 'Grenade',
            2: 'Jump',
            3: 'Super',
            4: 'Melee',
            5: 'Stats',
            6: 'Other',
            7: 'Stats',
            8: 'Other'
        };

        $scope.perkTotal = 0;
        $scope.exoticTotal = 0;

        $scope.chartsReady = false;
        $scope.subclassKd = charts.get('subclass-kd');
        $scope.subclassWinRate = charts.get('subclass-win-rate');

        gamedata.get('subclass-nodes').then(function(result) {
            var perks = result.data[consts.subclassToId($stateParams.subclass)];

            api
                .getSubclassPerks($stateParams.subclass)
                .then(function(result) {
                    var filtered = [],
                        totals = {};

                    _.each(result.data, function(row) {
                        var perk = perks[row.nodeHash];

                        // no definition = no bueno
                        if (!perk) {
                            return;
                        }

                        // skip sprint and perks everyone gets
                        if (perk.col == -1 || ([2, 3, 4].indexOf(perk.col) != -1 && perk.row == 0)) {
                            return;
                        }

                        if (!filtered[perk.col]) {
                            filtered[perk.col] = [];
                        }

                        filtered[perk.col].push({
                            name: perk.name,
                            description: perk.description,
                            icon: perk.icon,
                            row: perk.row,
                            total: row.total,
                            deaths: row.deaths,
                            kills: row.kills,
                            wins: row.wins
                        });

                        if (!totals[perk.col]) {
                            totals[perk.col] = 0;
                        }

                        totals[perk.col] += row.total
                    });

                    $scope.perks = filtered;
                    $scope.perkTotals = totals;
                });
        });

        gamedata.get('items').then(function(result) {
            var exotics = result.data;

            api
                .getSubclassExotics($stateParams.subclass)
                .then(function(result) {
                    var filtered = {},
                        totals = {};

                    _.each(result.data, function(row) {
                        var exotic = exotics[row.itemHash];

                        if (!exotic) {
                            return;
                        }

                        if (!filtered[exotic.typeName]) {
                            filtered[exotic.typeName] = [];
                        }

                        filtered[exotic.typeName].push({
                            name: exotic.name,
                            description: exotic.description,
                            icon: exotic.icon,
                            total: row.total,
                            deaths: row.deaths,
                            kills: row.kills,
                            wins: row.wins
                        });

                        if (!totals[exotic.typeName]) {
                            totals[exotic.typeName] = 0;
                        }

                        totals[exotic.typeName] += row.total
                    });

                    $scope.exotics = filtered;
                    $scope.exoticTotals = totals;
                });
        });

        api
            .getSubclassDetails($stateParams.subclass)
            .then(function(result) {
                _.each(result, function(data) {
                    $scope.subclassKd.series[0].data.push({
                        y: data.kills / data.deaths,
                        name: consts.modes[data.mode]
                    });

                    $scope.subclassWinRate.series[0].data.push({
                        y: data.wins / data.total * 100,
                        name: consts.modes[data.mode]
                    })
                });

                $scope.chartsReady = true;
            });


        $scope.nodeFilter = function(a) {
            var node = $scope.perkData[a];

            if (!node) {
                return -9999;
            }

            return node.col;
        };
    }
]);