var app = angular.module('app');

app.factory('pgcrFactory', [
    '$q',
    'consts',
    'api',
    'bungie',

    function ($q, consts, api, bungie) {
        return function(instanceId)
        {
            var self = this;
            var pgcr = {
                period: null,
                statDefinitions: {},
                definitions: {},
                details: {},
                teams: {},
                mode: null
            };

            this.getStatDefinitions = function() {
                return pgcr.statDefinitions;
            };

            this.getDetails = function() {
                return pgcr.details;
            };

            this.getTeams = function() {
                return pgcr.teams;
            };

            this.getMode = function() {
                return pgcr.mode;
            };

            this.getPeriod = function() {
                return pgcr.period;
            };

            this.getDefinitions = function() {
                return pgcr.definitions;
            };

            this.load = function(instanceId) {
                return $q(function(resolve, reject) {
                    bungie
                        .getStatDefinitions()
                        .then(function(response) {
                            pgcr.statDefinitions = response.data.Response;

                            return bungie.getPgcr(instanceId);
                        }, function(err) {
                            reject(err);
                        })
                        .then(function(response) {
                            var response = response.data.Response;

                            pgcr.details = response.data.activityDetails;
                            pgcr.mode = pgcr.details.mode;
                            pgcr.teams = {};
                            pgcr.period = response.data.period;
                            pgcr.definitions = response.definitions;
                            var deserters = [];

                            var membershipIds = [];
                            _.each(response.data.entries, function(player) {
                                membershipIds.push(player.player.destinyUserInfo.membershipId);
                                var teamId = player.values.team ? player.values.team.basic.value : 0;

                                if (!pgcr.teams[teamId]) {
                                    pgcr.teams[teamId] = {
                                        standing: _.find(response.data.teams, function(team) {
                                            return team.teamId == teamId;
                                        }),
                                        elo: 0,
                                        players: []
                                    };
                                }

                                // Rumble standings start at 0
                                if (pgcr.mode == 13) {
                                    if (player.values.completed.basic.value === 1 || player.standing > 0) {
                                        player.standing += 1;
                                    }
                                }

                                if (player.values.completed.basic.value === 1) {
                                    pgcr.teams[teamId].players.push(player);
                                } else {
                                    deserters.push(player);
                                }
                            });

                            if (deserters.length > 0) {
                                pgcr.teams[99] = {
                                    elo: 0,
                                    players: deserters
                                };
                            }

                            var match, day;
                            if (match = response.data.period.match(/\d+-\d+-\d+/)) {
                                day = match[0];
                            }

                            if (!day) {
                                return;
                            }

                            return api.getEloHistory(membershipIds, day, response.data.activityDetails.mode);
                        }, function(err) {
                            reject(err);
                        })
                        .then(function(result) {
                            var elos = result.data;

                            _.each(pgcr.teams, function(team) {
                                _.each(team.players, function(player) {
                                    player.elo = _.find(elos, function(elo) {
                                        return elo.membershipId == player.player.destinyUserInfo.membershipId;
                                    });

                                    if (!player.values.team) {
                                        return;
                                    }

                                    if (player.elo) {
                                        team.elo += player.elo ? player.elo.elo : 1200;
                                    }
                                });
                            });

                            _.each(pgcr.teams, function(team) {
                                team.elo = Math.round(team.elo / team.players.length);

                                team.players.sort(function(a, b) {
                                    if (a.standing < b.standing) return -1;
                                    if (a.standing > b.standing) return 1;
                                    if (a.values.score.basic.value < b.values.score.basic.value) return 1;
                                    if (a.values.score.basic.value > b.values.score.basic.value) return -1;
                                    if (a.values.killsDeathsRatio.basic.value < b.values.killsDeathsRatio.basic.value) return 1;
                                    if (a.values.killsDeathsRatio.basic.value > b.values.killsDeathsRatio.basic.value) return -1;

                                    return 0;
                                });
                            });

                            if (pgcr.teams[17] && pgcr.teams[16]) {
                                pgcr.teams[17].chance = 1 / (1.0 + Math.pow(10, (pgcr.teams[16].elo - pgcr.teams[17].elo) / 400)) * 100;
                                pgcr.teams[16].chance = 1 / (1.0 + Math.pow(10, (pgcr.teams[17].elo - pgcr.teams[16].elo) / 400)) * 100;
                            }

                            resolve();
                        }, function(err) {
                            reject(err);
                        });
                });
            };
        };
    }
]);
