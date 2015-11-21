var app = angular.module('app');

app.controller('layoutCtrl', [
    '$scope',
    '$location',
    '$state',
    '$stateParams',
    '$localStorage',
    '$window',
    'consts',
    'gettext',
    'gettextCatalog',

    function ($scope, $location, $state, $stateParams, $localStorage, $window, consts, gettext, gettextCatalog) {
        $scope.placeholder = $localStorage.searchPlaceholder ?
            $localStorage.searchPlaceholder : gettext('Search for a Guardian...');

        $scope.languages = consts.languages;

        $scope.hreflangs = function() {
            var uris = {};

            _.each($scope.languages, function(lang, key) {
                uris[key] = $location
                    .absUrl()
                    .replace('/' + gettextCatalog.getCurrentLanguage() + '/', '/' + key + '/');
            });

            return uris;
        };

        $scope.currentLanguage = function() {
            return gettextCatalog.getCurrentLanguage();
        };

        $scope.changeLanguage = function(lang) {
            $localStorage.locale = lang;
            $state.go($state.current.name, { locale: lang });
            $window.location.reload();
        };

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
