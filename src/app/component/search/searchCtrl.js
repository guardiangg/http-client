var app = angular.module('app');

app.controller('searchCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'bungie',

    function ($scope, $state, $stateParams, bungie) {
        $scope.done = false;
        $scope.name = $stateParams.name;
        $scope.results = [];

        bungie
            .searchForPlayer(1, $scope.name)
            .then(function(result) {
                if (result.data.Response.length > 0) {
                    $scope.results.push(1);
                }
                return bungie.searchForPlayer(2, $scope.name);
            })
            .then(function(result) {
                if (result.data.Response.length > 0) {
                    $scope.results.push(2);
                }

                $scope.done = true;

                if ($scope.results.length == 1) {
                    $state.go('app.profile', { platform: $scope.results[0], name: $scope.name });
                }
            });
    }
]);