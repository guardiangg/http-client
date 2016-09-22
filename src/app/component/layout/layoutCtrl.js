var app = angular.module('app');

app.controller('layoutCtrl', [
    '$rootScope',
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

    function ($rootScope, $scope, $location, $state, $stateParams, $localStorage, $window, consts, gettext, gettextCatalog, notice) {
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

        $rootScope.$on('$stateChangeStart', function() {
            $rootScope.apiError = false;
        });

        $scope.currentLanguage = function() {
            return gettextCatalog.getCurrentLanguage();
        };

        $scope.changeLanguage = function(lang) {
            var current = gettextCatalog.getCurrentLanguage();
            $localStorage.locale = lang;
            $window.location = $location.absUrl().replace('/' + current + '/', '/' + lang + '/');
        };

        $scope.searchSite = function(query) {
            if (!query || query.trim().length == 0) {
                if (!$localStorage.searchPlaceholder) {
                    return
                }
                query = $localStorage.searchPlaceholder;
            }

            $scope.placeholder = $localStorage.searchPlaceholder = query;
            $scope.query = '';
            $state.go('app.search', { query: query });
        };
    }
]);
