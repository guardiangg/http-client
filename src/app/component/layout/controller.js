var app = angular.module('app');

app.controller('layoutCtrl', [
    '$scope',
    '$state',

    function ($scope, $state) {
        $scope.searchForPlayer = function(name) {
            if (!name || name.trim().length == 0) {
                return;
            }

            $state.go('app.search', { name: name });
        };
    }
]);
