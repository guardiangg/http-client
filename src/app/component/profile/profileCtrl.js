var app = angular.module('app');

app.controller('profileCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$location',
    '$localStorage',
    '$timeout',
    'api',
    'bungie',
    'consts',
    'charts',
    'auditFactory',

    function ($rootScope, $scope, $state, $stateParams, $location, $localStorage, $timeout, api, bungie, consts, charts, auditFactory) {
        var defaultPvpMode = $localStorage.profilePvpMode || 5,
            defaultPveMode = $localStorage.profilePveMode || 7,
            defaultSrlMode = $localStorage.profileSrlMode || 29;

        $scope.state = $stateParams.state || 'pvp';

        if (!$stateParams.mode) {
            $state.go('app.profile', {
                platform: $stateParams.platform,
                name: $stateParams.name,
                mode: defaultPvpMode
            });
            return;
        }

        $scope.mode = $stateParams.mode;
        $scope.modes = consts.modes;
        $scope.seasons = consts.seasons;
        $scope.seasonSrl = consts.currentSeasonSrl;
        $scope.seasonsSrl = consts.seasonsSrl;
        $scope.showMoreRecords = false;
        $scope.modeIcons = consts.modeIcons;
        $scope.srlMaps = consts.srl_maps;
        $scope.classes = consts.classes;
        $scope.eloChart = charts.get('profile-elo');
        $scope.eloChartEmpty = true;
        $scope.loading = {
            activityHistory: true,
            elo: true,
            eloHistory: true,
            fireteam: true,
            name: true,
            character: true,
            inventory: true,
            strikes: true,
            srl: true
        };
        $scope.maintenance = {
            activityHistory: false,
            fireteam: false,
            name: false,
            character: false,
            inventory: false
        };
        $scope.legacy = false;

        $scope.setState = function(state) {
            $scope.state = state;

            $state.transitionTo('app.profile', {
                platform: $stateParams.platform,
                name: $stateParams.name,
                mode: $scope.mode,
                state: $scope.state != 'pvp' ? $scope.state : null
            }, {
                reload: false,
                notify: false
            });

            if (state == 'pvp') {
                $scope.setMode(defaultPvpMode);
            } else if (state == 'pve') {
                $scope.setMode(defaultPveMode);
            } else if (state == 'srl') {
                $scope.setMode(defaultSrlMode);
            }
        };

        $scope.loadHistory = function(mode, platform, membershipId) {
            if (!$scope.character || $scope.infiniteScroll) {
                return;
            }

            $scope.infiniteScroll = true;

            bungie
                .getActivityHistory(
                    platform,
                    membershipId,
                    $scope.character.characterBase.characterId,
                    mode,
                    $scope.page++
                )
                .then(function(result) {
                    var defs = result.data.Response.definitions.activities;
                    var activities = result.data.Response.data.activities;

                    _.each(activities, function(activity) {
                        activity.definition = defs[activity.activityDetails.referenceId];
                    });

                    $scope.activities.push.apply($scope.activities, activities);
                    $scope.loading.activityHistory = false;

                    if (Object.keys(result.data.Response.data).length &&
                        Object.keys(result.data.Response.data.activities).length
                    ) {
                        $scope.infiniteScroll = false;
                    }
                }, function() {
                    $scope.loading.activityHistory = false;
                    $scope.maintenance.activityHistory = true;
                });
        };

        $scope.setMode = function(mode) {
            $state.transitionTo(
                'app.profile',
                {
                    platform: $stateParams.platform,
                    name: $stateParams.name,
                    mode: mode,
                    state: $scope.state != 'pvp' ? $scope.state : null
                },
                {
                    reload: false,
                    notify: false
                }
            );

            setMode(mode);
        };

        $scope.setSeason = function(season) {
            $scope.season = season;
            $scope.showMoreRecords = false;
        };

        $scope.setSeasonSrl = function(season) {
            $scope.seasonSrl = season;
            $scope.loading.srl = true;

            api.getSrl($scope.membershipId, $scope.seasonSrl)
                .then(function(result) {
                    $scope.srl = result.data;
                    $scope.loading.srl = false;
                });
        };

        $scope.revealRecords = function() {
            $scope.showMoreRecords = true;
        };

        var setMode = function(mode, force) {
            $scope.infiniteScroll = false;

            if ($scope.mode == mode && !force) {
                return;
            }

            $scope.eloChartEmpty = true;

            _.each($scope.eloChart.series, function(series) {
                series.visible = mode == series.mode;

                if (series.mode == mode && series.data && series.data.length > 0) {
                    $scope.eloChartEmpty = false;
                }
            });

            $scope.activities = [];
            $scope.page = 0;

            if ($scope.state == 'pvp') {
                $localStorage.profilePvpMode = mode;
                defaultPvpMode = mode;

            } else if ($scope.state == 'pve') {
                $localStorage.profilePveMode = mode;
                defaultPveMode = mode;

            } else if ($scope.state == 'srl') {
                $localStorage.profileSrlMode = mode;
                defaultSrlMode = mode;

            }

            $scope.mode = mode;

            $scope.loading.activityHistory = true;
            $scope.maintenance.activityHistory = false;
            $scope.loading.fireteam = true;
            $scope.maintenance.fireteam = false;

            $scope.loadHistory(mode, $scope.platform, $scope.membershipId);

            api
                .getFireteam(mode, $scope.membershipId)
                .then(function(result) {
                    $scope.fireteam = result.data;
                    $scope.loading.fireteam = false;
                });
        };

        $scope.loadInventory = function() {
            $scope.loading.inventory = true;
            $scope.maintenance.inventory = false;

            bungie
                .getInventory(
                    $scope.platform,
                    $scope.membershipId,
                    $scope.character.characterBase.characterId
                )
                .then(function(response) {
                    $scope.items = response.data.Response.data.buckets.Equippable;
                    $scope.definitions = response.data.Response.definitions;
                    //audit.setLoadout($scope.items);
                    //audit.setDefinitions($scope.definitions);
                    $scope.loading.inventory = false;
                    $timeout(function() {
                        gggTips.run();
                    });
                }, function(err) {
                    $scope.loading.inventory = false;
                    $scope.maintenance.inventory = true;
                });
        };

        $scope.changeCharacter = function(index) {
            if (index == $scope.characterIndex) {
                return;
            }

            $scope.characterIndex = index;
            $scope.character = $scope.characters[$scope.characterIndex];
            //audit.setCharacter($scope.character);

            setMode($scope.mode, true);
            $scope.loadInventory();
        };

        $scope.statToTier = function(stat) {
            var normalized = Math.floor(stat / 60);
            if (normalized > 5) {
                return 5;
            } else {
                return normalized;
            }
        };

            $scope.getSuperCooldown = function(stat, items) {
                var tiers = {};
                var subClass = _.find(items, function(i) {
                    return i.bucketHash == consts.buckets['subclass'];
                });
                if (subClass) {
                    if ([3658182170,2007186000,2455559914,4143670657].indexOf(subClass.items[0].itemHash) > -1 ) {
                        tiers = {
                            0: '5:00',
                            1: '4:46',
                            2: '4:31',
                            3: '4:15',
                            4: '3:58',
                            5: '3:40'
                        };
                    } else {
                        tiers = {
                            0: '5:30',
                            1: '5:14',
                            2: '4:57',
                            3: '4:39',
                            4: '4:20',
                            5: '4:00'
                        };
                    }
                    return tiers[$scope.statToTier(stat)];
                }
            };

        $scope.getUtilityCooldown = function(stat) {
            var tiers = {
                0: '1:00',
                1: '0:55',
                2: '0:49',
                3: '0:42',
                4: '0:34',
                5: '0:25'
            };

            return tiers[$scope.statToTier(stat)];
        };

        var load = function(platform, membershipId) {
            $scope.loading.elo = true;
            api
                .getEloByMembershipId(membershipId)
                .then(function(result) {
                    _.each(result.data, function(elo) {
                        elo.league = consts.ratingToLeague(elo.elo);
                    });

                    // inactive -2
                    // placing  -1
                    result.data.sort(function(a, b) {
                        if (b.rank == a.rank) {
                            return 0;
                        }
                        if (a.rank == -1) {
                            return 1;
                        }
                        if (b.rank == -1) {
                            return -1;
                        }
                        if (a.rank == -2) {
                            if (b.rank == -1) {
                                return -1;
                            }
                            return 1;
                        }
                        if (b.rank == -2) {
                            if (a.rank == -1) {
                                return 1;
                            }
                            return -1;
                        }
                        return a.rank - b.rank;
                    });

                    // Temp hide SRL Elo (do we even want this anymore?)
                    for (var i = 0; i < result.data.length ; i++) {
                        if (result.data[i].mode == 29) {
                            result.data.splice(i, 1);
                        }
                    }

                    $scope.elos = result.data;
                    $scope.loading.elo = false;
                });

            $scope.loading.eloHistory = true;
            $scope.loading.srl = true;
            $scope.loading.character = true;
            $scope.maintenance.character = false;

            api
                .getEloChart(membershipId)
                .then(function(eloResult) {
                    var elo = {};
                    var kd = {};
                    var highest = {mode: null, elo: 0};

                    _.each(eloResult.data, function(row) {
                        if (!elo[row.mode]) {
                            elo[row.mode] = [];
                        }
                        elo[row.mode].push({ x: row.x, y: row.y });

                        if (row.y > highest.elo) {
                            highest.elo = row.y;
                            highest.mode = row.mode;
                        }
                    });

                    api
                        .getKdChart(membershipId)
                        .then(function(kdResult) {
                            _.each(kdResult.data, function(row) {
                                if (!kd[row.mode]) {
                                    kd[row.mode] = [];
                                }
                                kd[row.mode].push({ x: row.x, y: row.y });
                            });

                            $scope.eloChart.series = [];

                            _.each(elo, function(data, mode) {
                                $scope.eloChart.series.push({
                                    mode: mode,
                                    data: data,
                                    name: 'Elo',
                                    color: '#404040',
                                    visible: false
                                });

                                if (kd[mode]) {
                                    $scope.eloChart.series.push({
                                        mode: mode,
                                        data: kd[mode],
                                        name: 'K:D',
                                        color: '#ecaa4a',
                                        yAxis: 1,
                                        visible: false
                                    });
                                }
                            });

                            $scope.eloChart.series.push({
                                mode: 5,
                                data: kd[highest.mode],
                                name: $scope.modes[highest.mode] + ' K:D',
                                color: '#ecaa4a',
                                yAxis: 1,
                                visible: false
                            });

                            $scope.eloChart.series.push({
                                mode: 5,
                                data: elo[highest.mode],
                                name: $scope.modes[highest.mode] + ' Elo',
                                color: '#404040',
                                visible: false
                            });

                            $scope.loading.eloHistory = false;
                        });

                    return api.getSeasonStatsByMembershipId(membershipId)
                })
                .then(function(result) {
                    $scope.seasonData = {};

                    _.each(result.data.data, function(data, k) {
                        if (!$scope.seasonData[data.season]) {
                            $scope.seasonData[data.season] = [];
                        }

                        data.league = consts.ratingToLeague(data.elo);

                        // Temp hide SRL Elo (do we even want this anymore?)
                        if (data.mode != 29) {
                            $scope.seasonData[data.season].push(data);
                        }
                    });
                    
                    if (result.data.data.length > 0) {
                        $scope.season = result.data.data[0].season;
                    }

                    return api.getSrl(membershipId, $scope.seasonSrl);
                }, function(err) {
                    $scope.season = false;

                    return api.getSrl(membershipId, $scope.seasonSrl);
                })
                .then(function(result) {
                    $scope.srl = result.data;
                    $scope.loading.srl = false;

                    return api.getStrikes(membershipId);
                })
                .then(function(result) {
                    $scope.strikes = result.data;
                    $scope.loading.strikes = false;

                    console.log($scope.strikes);

                    return bungie.getAccount(platform, membershipId);
                })
                .then(function(response) {
                    if (response.data.ErrorCode && response.data.ErrorCode == 1670) {
                        $scope.legacy = true;
                        $scope.loading.character = false;
                        $scope.loading.inventory = false;
                        $scope.loading.fireteam = false;
                        $scope.loading.name = false;
                        $scope.loading.activityHistory = false;
                        return;
                    }

                    $scope.characters = response.data.Response.data.characters;

                    var idx = 0;
                    var maxLastPlayed = 0;

                    _.each($scope.characters, function(c, i) {
                        var lastPlayed = moment(c.characterBase.dateLastPlayed).unix();
                        if (lastPlayed > maxLastPlayed) {
                            idx = i;
                            maxLastPlayed = lastPlayed;
                        }
                    });

                    $scope.loading.character = false;
                    $scope.changeCharacter(idx);
                }, function(err) {
                    $scope.loading.character = false;
                    $scope.maintenance.character = true;
                });
        };

        bungie
            .searchForPlayer($stateParams.platform, $stateParams.name)
            .then(function(response) {
                if (response.data.Response.length == 0) {
                    $location.url('/');
                    return;
                }

                $scope.name = response.data.Response[0].displayName;
                $rootScope.title = $scope.name + ' - Destiny PvP Profile - Guardian.gg';
                $scope.loading.name = false;
                $scope.membershipId = response.data.Response[0].membershipId;
                $scope.platform = response.data.Response[0].membershipType;

                load($scope.platform, $scope.membershipId);
            }, function(err) {
                $scope.loading.name = false;
                $scope.maintenance.name = true;
            });

        $scope.$on('$destroy', function() {
            angular.element('body').find('.tooltip').remove();
        });

        $scope.loadMoreHistory = function() {
            $scope.loadHistory($scope.mode, $scope.platform, $scope.membershipId);
        }
    }
]);
