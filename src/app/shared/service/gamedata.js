(function() {
    var Gamedata = function($q, $http, gettextCatalog, util) {
        var PAGE_SIZE = 100;

        this.getPage = function(type, page) {
            return $q(function(resolve, reject) {
                $http
                    .get(
                        util.buildApiUrl(
                            'gamedata/{type}?offset={offset}&lc={lc}',
                            {
                                type: type,
                                offset: page * PAGE_SIZE,
                                lc: gettextCatalog.getCurrentLanguage()
                            }
                        )
                    )
                    .then(function(r) {
                        resolve({
                            data: r.data.data,
                            pageCount: r.data.pageCount,
                            pageSize: r.data.pageSize,
                            totalItems: r.data.totalItems
                        });
                    }, reject)
            });
        };
    };

    angular.module('app').service('gamedata', [
        '$q',
        '$http',
        'gettextCatalog',
        'util',

        function ($q, $http, gettextCatalog, util) {
            return new Gamedata($q, $http, gettextCatalog, util);
        }
    ]);
})();