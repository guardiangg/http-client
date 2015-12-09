var app = angular.module('app');

app.filter('timeTrial', function() {
    return function(time) {
        return moment.duration(time, "milliseconds").format('m:ss.SSS');
    }
});
