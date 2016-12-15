var app = angular.module('app');

app.service('strikeApi', [
    '$http',
    'util',

    function ($http, util) {
        return new function () {
            this.getGamedata = function () {
                return $http.get(
                    util.buildApiUrl('strike/gamedata')
                );
            };

            this.getPage = function (period, platform, mode, referenceId, page) {
                var url = 'strike-weekly/{platform}/{mode}/{referenceId}/{page}';

                if (period == 'all') {
                    url = 'strike/{platform}/{mode}/{referenceId}/{page}';
                }

                return $http.get(
                    util.buildApiUrl(url, {
                        platform: platform,
                        mode: mode,
                        referenceId: referenceId,
                        page: page
                    })
                );
            };

            this.search = function(period, platform, mode, referenceId, name) {
                var url = 'strike-weekly/search/{platform}/{mode}/{referenceId}/{name}';

                if (period == 'all') {
                    url = 'strike/search/{platform}/{mode}/{referenceId}/{name}';
                }

                return $http.get(
                    util.buildApiUrl(url, {
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
