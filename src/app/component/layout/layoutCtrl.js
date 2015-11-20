var app = angular.module('app');

app.controller('layoutCtrl', [
    '$scope',
    '$location',
    '$state',
    '$stateParams',
    '$localStorage',
    '$window',
    'gettext',
    'gettextCatalog',

    function ($scope, $location, $state, $stateParams, $localStorage, $window, gettext, gettextCatalog) {
        $scope.placeholder = $localStorage.searchPlaceholder ?
            $localStorage.searchPlaceholder : gettext('Search for a Guardian...');

        $scope.languages = {
            de: 'Deutsch',
            en: 'English',
            es: 'Español',
            fr: 'Français',
            it: 'Italiano',
            'pt-br': 'Português (Brasil)',
            ja: '日本語'
        };

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
