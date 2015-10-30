app.service('api',[
    '$http',
    '$q',
    'consts',
    'datastore',
    'util',

    function($http, $q, consts, datastore, util) {
        return new function() {
            var endpoints = {
                chart: {
                    eloHistory: 'chart/elo/{membershipId}',
                    subclassDetails: 'chart/subclass/{subclassId}?modes=9,10,12,13,14,19,23,24',
                    subclassTotals: 'chart/subclass?modes=9,10,12,13,14,19,23,24'
                },

                clan: 'clan/{clanName}',
                clanCompletions: 'clan/{clanName}/completions',

                homeStats: 'home/stats',
                homeWorldStats: 'home/world-first/{referenceId}',

                elo: 'elo/{membershipId}',
                eloHistory: 'elo/history/{membershipIds}',

                subclassExotics: 'subclass/{subclassId}/exotics?mode={mode}&start={start}&end={end}',
                subclassPerks: 'subclass/{subclassId}/perks?mode={mode}&start={start}&end={end}',

                // old, need updated below this
                classBalance: '/api/carnage/chart/class-usage',
                winRatio: '/api/carnage/chart/team-wins',
                weapons: '/api/carnage/chart/top-weapons',
                weaponTypes: '/api/carnage/chart/weapon-type-ranges',
                activities: '/api/gamedata/activity/mode/{mode}'
            };

            this.getClan = function(clanName) {
                return $http.get(util.buildApiUrl(endpoints.clan, {
                    clanName: clanName
                }));
            };

            this.getSubclassPerks = function(params) {
                return $http.get(util.buildApiUrl(endpoints.subclassPerks, params));
            };

            this.getSubclassExotics = function(params) {
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

            this.getHomeWorldFirsts = function(referenceId) {
                return $http.get(
                    util.buildApiUrl(endpoints.homeWorldStats, {
                        referenceId: referenceId
                    })
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

            this.getActivitiesByMode = function(mode) {
                return this.get(endpoints['activities'].replace('{mode}', mode));
            };

            this.getClanCompletions = function(clanName) {
                return $http.get(
                    util.buildApiUrl(endpoints.clanCompletions, {
                        clanName: clanName
                    })
                );
            };

            this.getClassBalance = function() {
                return this.get(endpoints['classBalance'], true);
            };

            this.getWinRatio = function() {
                return this.get(endpoints['winRatio'], true);
            };

            this.getWeapons = function() {
                return this.get(endpoints['weapons'], true);
            };

            this.getWeaponTypes = function() {
                return this.get(endpoints['weaponTypes'], true);
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
