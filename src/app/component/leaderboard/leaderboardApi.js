var app = angular.module('app');

app.service('leaderboardApi', [
    '$http',
    'util',

    function ($http, util) {
        return new function () {
            this.getFeatured = function(modes) {
                modes = modes ? modes : ['10', '19'];
                modes = modes.join(',');

                return $http.get(util.buildApiUrl('leaderboard/featured?modes={modes}', { modes: modes }));
            };

            this.getPage = function (platform, mode, page) {
                return $http.get(
                    util.buildApiUrl('leaderboard/{platform}/{mode}/{page}', {
                        platform: platform,
                        mode: mode,
                        page: page
                    })
                );
            };

            this.search = function(platform, mode, name) {
                return $http.get(
                    util.buildApiUrl('leaderboard/search/{platform}/{mode}/{name}', {
                        platform: platform,
                        mode: mode,
                        name: name
                    })
                );
            };
        };
    }
]);
