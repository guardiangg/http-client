var app = angular.module('app');

app.filter('ago', function() {
    return function(str) {
        return moment(str).fromNow();
    }
});
