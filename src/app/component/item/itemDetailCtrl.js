var app = angular.module('app');

app.controller('itemDetailCtrl', [
    '$scope',
    '$stateParams',
    'gamedata',

    function ($scope, $stateParams, gamedata) {
        gamedata
            .get('items', $stateParams.hash)
            .then(function(r) {
                $scope.entity = r;
            });
    }
]);
