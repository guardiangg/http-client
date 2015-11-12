var app = angular.module('app');

app.controller('worldFirstCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'api',

    function ($scope, $location, $routeParams, api) {
        api
            .getWorldFirsts()
            .then(function(result) {
                $scope.firsts = result.data;
            })
    }
]);