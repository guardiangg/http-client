var app = angular.module('app');

app.controller('itemCtrl', [
    '$scope',
    'gamedata',

    function ($scope, gamedata) {
        gamedata
            .getPage('items', 0)
            .then(function(r) {
                console.log(r);
            });
    }
]);
