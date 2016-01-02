var app = angular.module('app');

app.controller('searchCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$q',
    '$timeout',
    'api',
    'bungie',
    'util',

    function ($scope, $state, $stateParams, $q, $timeout, api, bungie, util) {
        $scope.done = false;
        $scope.query = $stateParams.query;
        $scope.results = [];

        var searches = {};
        searches.gamedata = api.searchGamedata($scope.query);
        searches.xbox = bungie.searchForPlayer(1, $scope.query);
        searches.playstation = bungie.searchForPlayer(2, $scope.query);

        $q
            .all(searches)
            .then(function(result) {
                var count = 0;

                _.each(result.gamedata.data, function(data) {
                    count+= data.totalItems;
                });

                // we have gamedata
                if (count > 0) {
                    $scope.gamedata = result.gamedata.data;
                }

                // check profiles
                if (result.xbox.data.Response.length > 0 && result.playstation.data.Response.length > 0) {
                    count += 2;

                    $scope.playstation = true;
                    $scope.xbox = true;
                } else if (result.xbox.data.Response.length > 0) {
                    if (count == 0) {
                        $state.go('app.profile', {platform: 1, name: $scope.query});
                        return;
                    }
                    $scope.xbox = true;
                } else if (result.playstation.data.Response.length > 0) {
                    if (count == 0) {
                        $state.go('app.profile', {platform: 2, name: $scope.query});
                        return;
                    }
                    $scope.playstation = true;
                }

                // if we only have one result redirect to gamedata
                if (count == 1) {
                    if (result.gamedata.data.items.data.length) {
                        var entity = result.gamedata.data.items.data[0];

                        $state.go('app.itemDetailName', { hash: entity.hash, name: util.slugify(entity.name) });
                        return;
                    }
                }

                $scope.count = count;
                $scope.done = true;
                $timeout(function() {
                    window["gggTips"].run();
                });
            });
    }
]);