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
    'notice',

    function ($scope, $location, $state, $stateParams, $localStorage, $window, consts, gettext, gettextCatalog, notice) {
        $scope.placeholder = $localStorage.searchPlaceholder ?
            $localStorage.searchPlaceholder : gettext('Search for a Guardian...');

        $scope.languages = consts.languages;
        $scope.notices = [];
        $scope.hideNotice = notice.hide;
        notice.getActive().then(function(notices) {
            $scope.notices = notices;
        });

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
            var current = gettextCatalog.getCurrentLanguage();
            $localStorage.locale = lang;
            $window.location = $location.absUrl().replace('/' + current + '/', '/' + lang + '/');
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
