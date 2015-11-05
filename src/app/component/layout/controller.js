var app = angular.module('app');

app.controller('layoutCtrl', [
    '$scope',
    '$state',
    '$localStorage',
    'gettext',

    function ($scope, $state, $localStorage, gettext) {
        $scope.placeholder = $localStorage.searchPlaceholder ?
            $localStorage.searchPlaceholder : gettext('Search for a Guardian...');

        $scope.searchForPlayer = function(name) {
            if (!name || name.trim().length == 0) {
                if (!$localStorage.searchPlaceholder) {
                    return
                }
                name = $localStorage.searchPlaceholder;
            }

            $scope.placeholder = $localStorage.searchPlaceholder = name;
            $scope.name = '';
            $state.go('app.search', { name: name });
        };
    }
]);
