var app = angular.module('app');

app.controller('faqCtrl', [
    '$rootScope',
    'gettextCatalog',

    function ($rootScope, gettextCatalog) {
        $rootScope.title = gettextCatalog.getString('FAQ') + ' - Guardian.gg';
    }
]);
