var app = angular.module('app');

app.controller('layoutCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$localStorage',
    'gettext',
    'gettextCatalog',

    function ($scope, $state, $stateParams, $localStorage, gettext, gettextCatalog) {
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

        $scope.currentLanguage = function() {
            return gettextCatalog.getCurrentLanguage();
        };

        $scope.changeLanguage = function(lang) {
            $state.go($state.current.name, _.extend($stateParams, {locale: lang}));
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
