var app = angular.module('app');

app.service('srlApi', [
    '$http',
    'util',

    function ($http, util) {
        return new function () {
            this.getFeatured = function() {
                return $http.get(util.buildApiUrl('srl/featured'));
            };

            this.getPage = function (platform, map, page) {
                return $http.get(
                    util.buildApiUrl('srl/{platform}/{map}/{page}', {
                        platform: platform,
                        map: map,
                        page: page
                    })
                );
            };

            this.search = function(platform, map, name) {
                return $http.get(
                    util.buildApiUrl('srl/search/{platform}/{map}/{name}', {
                        platform: platform,
                        map: map,
                        name: name
                    })
                );
            };
        };
    }
]);
