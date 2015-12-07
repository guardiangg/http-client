var app = angular.module('app');

app.controller('itemDetailCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    'gamedata',

    function ($rootScope, $scope, $stateParams, gamedata) {
        gamedata
            .get('items', $stateParams.hash)
            .then(function(r) {
                $scope.entity = r;
                $rootScope.title = r.name + ' - Items - Guardian.gg';
            });
    }
]);
