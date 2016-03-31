var app = angular.module('app');

app.controller('privacyCtrl', [
    '$rootScope',
    'gettextCatalog',

    function ($rootScope, gettextCatalog) {
        $rootScope.title = gettextCatalog.getString('Privacy Policy') + ' - Guardian.gg';
    }
]);
