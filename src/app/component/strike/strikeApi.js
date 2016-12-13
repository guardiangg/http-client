var app = angular.module('app');

app.service('strikeApi', [
    '$http',
    'util',

    function ($http, util) {
        return new function () {
            this.getPage = function (platform, mode, referenceId, page) {
                return $http.get(
                    util.buildApiUrl('strike-weekly/{platform}/{mode}/{referenceId}/{page}', {
                        platform: platform,
                        mode: mode,
                        referenceId: referenceId,
                        page: page
                    })
                );
            };

            this.search = function(platform, mode, referenceId, name) {
                return $http.get(
                    util.buildApiUrl('strike-weekly/search/{platform}/{mode}/{referenceId}/{name}', {
                        platform: platform,
                        mode: mode,
                        referenceId: referenceId,
                        name: name
                    })
                );
            };
        };
    }
]);
