var app = angular.module('app');

app.controller('itemCtrl', [
    '$scope',
    '$location',
    'gamedata',

    function ($scope, $location, gamedata) {
        $scope.filters = {};

        $scope.load = function(page) {
            gamedata
                .getPage('items', page)
                .then(function(data) {
                    $scope.r = data;
                });
        };

        $scope.load(0);

        $scope.$watch('filters', function(value) {
            $location.search(value);
        });
    }
]);
