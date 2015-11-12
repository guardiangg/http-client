var app = angular.module('app');

app.controller('clanCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'api',

    function ($scope, $location, $routeParams, api) {
        api
            .getClan($routeParams.clanName)
            .then(function(result) {
                $scope.members = result.data;
                $scope.clanName = $scope.members[0].clanName;
                $scope.clanTag = $scope.members[0].clanTag;

                return api.getClanCompletions($routeParams.clanName);
            })
            .then(function(result) {
                $scope.completions = result.data;

                return gamedata.get('activities');
            })
            .then(function(result) {
                $scope.activities = result;
            });
    }
]);