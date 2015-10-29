var app = angular.module('app');

app.service('charts', [
    '$injector',

    function ($injector) {
        return new function() {
            this.get = function(name) {
                var key = 'chart-' + name;
                if (!$injector.has(key)) {
                    throw "Missing or invalid chart: " + name;
                }
                return angular.copy($injector.get(key));
            };
        };
    }
]);
