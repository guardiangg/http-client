var app = angular.module('app');

app.controller('itemDetailCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    'gamedata',
    'consts',
    'gettextCatalog',

    function ($rootScope, $scope, $stateParams, gamedata, consts, gettextCatalog) {
        $scope.tiers = consts.item_tiers;

        gamedata
            .get('items', $stateParams.hash)
            .then(function(r) {
                r.name = r.name || gettextCatalog.getString('[Unnamed Item]');
                $scope.entity = r;
                $rootScope.title = r.name + ' - Items - Guardian.gg';

                $scope.entity._displayStats = [];
                $scope.entity._hiddenStats = [];

                _.each(consts.stats.display, function(s, idx) {
                    var obj = _.find(r.stats, function(stat) {
                        return stat.hash.toString() === s;
                    });

                    if (!obj) {
                        return;
                    }

                    obj = angular.copy(obj);
                    obj.limit = Math.max(obj.max, 100);
                    obj.order = idx;

                    $scope.entity._displayStats.push(obj);
                });

                _.each(consts.stats.hidden, function(s, idx) {
                    var obj = _.find(r.stats, function(stat) {
                        return stat.hash.toString() === s;
                    });

                    if (!obj) {
                        return;
                    }

                    obj = angular.copy(obj);
                    obj.limit = Math.max(obj.max, 100);
                    obj.order = idx;

                    $scope.entity._hiddenStats.push(obj);
                });

                $scope.entity._displayStats = _.sortBy($scope.entity._displayStats, 'order');
                $scope.entity._hiddenStats = _.sortBy($scope.entity._hiddenStats, 'order');

                $scope.entity._primaryStats = {
                    attack: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.attack;
                    }),
                    defense: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.defense;
                    }),
                    magazine: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.magazine;
                    })
                }
            });
    }
]);
