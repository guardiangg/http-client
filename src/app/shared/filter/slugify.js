var app = angular.module('app');

app.filter('slugify', [
    'util',

    function(util) {
        return function(str) {
            return util.slugify(str);
        }
    }
]);
