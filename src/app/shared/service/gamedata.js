(function() {
    var Gamedata = function($q, $http, gettextCatalog, util) {
        var PAGE_SIZE = 100;

        this.get = function(type, hash) {
            return $q(function(resolve, reject) {
                $http
                    .get(
                        util.buildApiUrl(
                            'gamedata/{type}/{hash}?lc={lc}',
                            {
                                type: type,
                                hash: hash,
                                lc: gettextCatalog.getCurrentLanguage()
                            }
                        )
                    )
                    .then(function(r) {
                        resolve(r.data);
                    }, reject)
            });
        };

        this.getPage = function(type, page, filters) {
            var filterStr = '';
            if (filters) {
                _.each(filters, function(filter, id) {
                    filterStr += '&' + encodeURIComponent(id) + '=' + encodeURIComponent(filter);
                })
            }

            return $q(function(resolve, reject) {
                $http
                    .get(
                        util.buildApiUrl(
                            'gamedata/{type}?offset={offset}&lc={lc}{filters}',
                            {
                                type: type,
                                offset: page * PAGE_SIZE,
                                lc: gettextCatalog.getCurrentLanguage(),
                                filters: filterStr
                            }
                        )
                    )
                    .then(function(r) {
                        resolve({
                            page: parseInt(page),
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