app.service('api',[
    '$http',
    '$q',
    'consts',
    'datastore',
    'util',
    'gettextCatalog',

    function($http, $q, consts, datastore, util, gettextCatalog) {
        return new function() {
            var endpoints = {
                chart: {
                    eloHistory: 'chart/elo/{membershipId}',
                    subclassDetails: 'chart/subclass/{subclassId}?modes=9,10,12,13,14,19,23,24',
                    subclassTotals: 'chart/subclass?modes=9,10,12,13,14,19,23,24'
                },

                weapons: {
                    activitiesByMode: 'weapon-stats/activities?mode={mode}&lc={lc}'
                },

                clan: 'clan/{clanName}',
                clanCompletions: 'clan/{clanName}/completions',

                homeStats: 'home/stats',
                homeWorldStats: 'home/world-first/{referenceId}',

                elo: 'elo/{membershipId}',
                eloHistory: 'elo/history/{membershipIds}',

                subclassExotics: 'subclass/{subclassId}/exotics?mode={mode}&start={start}&end={end}&lc={lc}',
                subclassPerks: 'subclass/{subclassId}/perks?mode={mode}&start={start}&end={end}&lc={lc}'
            };

            this.getClan = function(clanName) {
                return $http.get(util.buildApiUrl(endpoints.clan, {
                    clanName: clanName
                }));
            };

            this.getSubclassPerks = function(params) {
                params.lc = gettextCatalog.getCurrentLanguage();
                return $http.get(util.buildApiUrl(endpoints.subclassPerks, params));
            };

            this.getSubclassExotics = function(params) {
                params.lc = gettextCatalog.getCurrentLanguage();
                return $http.get(util.buildApiUrl(endpoints.subclassExotics, params));
            };

            this.getSubclassTotals = function() {
                return this.get(util.buildApiUrl(endpoints.chart.subclassTotals), true);
            };

            this.getSubclassDetails = function(subclass) {
                return this.get(util.buildApiUrl(endpoints.chart.subclassDetails, {
                    subclassId: consts.subclassToId(subclass)
                }));
            };

            this.getHomeStats = function() {
                return $http.get(
                    util.buildApiUrl(endpoints.homeStats)
                );
            };

            this.getEloByMembershipId = function(membershipId) {
                return $http.get(
                    util.buildApiUrl(endpoints.elo, {
                        membershipId: membershipId
                    })
                );
            };

            this.getEloHistory = function(membershipIds, params) {
                if (!membershipIds.constructor == Array) {
                    membershipIds = [membershipIds];
                }

                return this.get(
                    util.buildApiUrl(endpoints.eloHistory, {
                        membershipIds: membershipIds.join(',')
                    }, params),
                    true
                );
            };

            this.getEloChart = function(membershipId, params) {
                return this.get(
                    util.buildApiUrl(endpoints.chart.eloHistory, {
                        membershipId: membershipId
                    }, params),
                    true
                );
            };

            this.getWeaponActivities = function(mode) {
                return $http.get(
                    util.buildApiUrl(endpoints.weapons.activitiesByMode, {
                        mode: mode,
                        lc: gettextCatalog.getCurrentLanguage()
                    })
                );
            };

            this.get = function(endpoint, queryString) {
                var deferred = $q.defer();

                if (queryString) {
                    endpoint += datastore.getQueryString();
                }

                $http.get(endpoint)
                    .then(function (result) {
                        deferred.resolve(result.data);
                    });

                return deferred.promise;
            };
        };
    }
]);
