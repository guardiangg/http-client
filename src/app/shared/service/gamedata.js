(function() {
    var Gamedata = function($q, $http, gettextCatalog, util, consts) {
        var PAGE_SIZE = 100;

        this.getRewardSourceByHash = function(hash) {
            var entity = false;

            _.each(consts.reward_sources, function(group) {
                var match = _.find(group.sources, function(source) {
                    return source.hash.toString() == hash.toString();
                });

                if (match) {
                    entity = match;
                }
            });

            return entity;
        };

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
                            'gamedata/{type}?lc={lc}{filters}',
                            {
                                type: type,
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
        'consts',

        function ($q, $http, gettextCatalog, util, consts) {
            return new Gamedata($q, $http, gettextCatalog, util, consts);
        }
    ]);
})();