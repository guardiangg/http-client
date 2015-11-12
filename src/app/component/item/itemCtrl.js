var app = angular.module('app');

app.controller('itemCtrl', [
    '$scope',
    'gamedata',

    function ($scope, gamedata) {
        $scope.load = function(page) {
            gamedata
                .getPage('items', page)
                .then(function(data) {
                    $scope.r = data;
                });
        };

        $scope.load(0);
    }
]);
