app.service('api',[
    '$http',
    '$location',
    'consts',
    'util',
    'gettextCatalog',

    function($http, $location, consts, util, gettextCatalog) {
        return new function() {
            var endpoints = {
                chart: {
                    eloHistory: 'chart/elo/{membershipId}',
                    kdHistory: 'chart/kd/{membershipId}',
                    subclassDetails: 'chart/subclass/{subclassId}?modes=9,10,12,13,14,19,23,24',
                    subclassTotals: 'chart/subclass?modes=9,10,12,13,14,19,23,24'
                },

                clan: 'clan/{clanName}',
                clanCompletions: 'clan/{clanName}/completions',

                fireTeam: 'fireteam/{mode}/{membershipId}',

                homeStats: 'home/stats',
                homeWorldStats: 'home/world-first/{referenceId}',

                elo: 'elo/{membershipId}',
                eloHistory: 'elo/history/{membershipIds}?start={start}&end={end}&mode={mode}',

                subclassExotics: 'subclass/{subclassId}/exotics?mode={mode}&start={start}&end={end}&lc={lc}',
                subclassPerks: 'subclass/{subclassId}/perks?mode={mode}&start={start}&end={end}&lc={lc}',

                srl: 'srl/{membershipId}'
            };

            this.getFireteam = function(mode, membershipId) {
                return $http.get(util.buildApiUrl(endpoints.fireTeam, {
                    mode: mode,
                    membershipId: membershipId
                }));
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
                return $http.get(util.buildApiUrl(endpoints.chart.subclassTotals));
            };

            this.getSubclassDetails = function(subclass) {
                return $http.get(util.buildApiUrl(endpoints.chart.subclassDetails, {
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

            this.getEloHistory = function(membershipIds, day, mode) {
                if (!membershipIds.constructor == Array) {
                    membershipIds = [membershipIds];
                }

                return $http.get(
                    util.buildApiUrl(endpoints.eloHistory, {
                        membershipIds: membershipIds.join(','),
                        start: day,
                        end: day,
                        mode: mode
                    })
                );
            };

            this.getEloChart = function(membershipId) {
                return $http.get(
                    util.buildApiUrl(endpoints.chart.eloHistory, {
                        membershipId: membershipId
                    })
                );
            };

            this.getKdChart = function(membershipId) {
                return $http.get(
                    util.buildApiUrl(endpoints.chart.kdHistory, {
                        membershipId: membershipId
                    })
                );
            };

            this.getSrl = function(membershipId) {
                return $http.get(
                    util.buildApiUrl(endpoints.srl, {
                        membershipId: membershipId
                    })
                );
            };
        };
    }
]);
