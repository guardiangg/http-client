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

        $scope.hreflangs = {};

        _.each($scope.languages, function(lang, key) {
            $scope.hreflangs[key] = $location
                .absUrl()
                .replace('/' + gettextCatalog.getCurrentLanguage() + '/', '/' + key + '/');
        });

        $scope.currentLanguage = function() {
            return gettextCatalog.getCurrentLanguage();
        };

        $scope.changeLanguage = function(lang) {
            $window.location = $scope.hreflangs[lang];
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
