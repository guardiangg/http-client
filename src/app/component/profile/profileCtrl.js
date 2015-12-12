var app = angular.module('app');

app.controller('profileCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$location',
    '$localStorage',
    'api',
    'bungie',
    'consts',
    'charts',
    'auditFactory',

    function ($rootScope, $scope, $stateParams, $location, $localStorage, api, bungie, consts, charts, auditFactory) {
        //var audit = new auditFactory($scope);
        $scope.mode = $localStorage.profileMode ? $localStorage.profileMode : 5;
        $scope.modes = consts.modes;
        $scope.modeIcons = consts.modeIcons;
        $scope.srlMaps = consts.srl_maps;
        $scope.classes = consts.classes;
        $scope.eloChart = charts.get('profile-elo');
        $scope.kdChart = charts.get('profile-kd');
        $scope.loading = {
            activityHistory: true,
            elo: true,
            eloHistory: true,
            fireteam: true,
            name: true,
            character: true,
            inventory: true,
            srl: true
        };
        $scope.maintenance = {
            activityHistory: false,
            fireteam: false,
            name: false,
            character: false,
            inventory: false
        };

        $scope.loadHistory = function(mode, platform, membershipId) {
            $scope.infiniteScroll = true;

            if (!$scope.character) {
                return;
            }

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

                    $scope.infiniteScroll = false;

                }, function(err) {
                    $scope.loading.activityHistory = false;
                    $scope.maintenance.activityHistory = true;
                });
        };

        var load = function(platform, membershipId) {
            $scope.setMode = function(mode, force) {
                if ($scope.mode == mode && !force) {
                    return;
                }

                _.each($scope.eloChart.series, function(series, index) {
                    series.visible = mode == 5 || mode == index;
                });

                _.each($scope.kdChart.series, function(series, index) {
                    series.visible = mode == 5 || mode == index;
                });

                $scope.activities = [];
                $scope.page = 0;

                $localStorage.profileMode = mode;

                $scope.mode = mode;

                $scope.loading.activityHistory = true;
                $scope.maintenance.activityHistory = false;
                $scope.loading.fireteam = true;
                $scope.maintenance.fireteam = false;

                $scope.loadHistory(mode, platform, membershipId);

                api
                    .getFireteam(mode, membershipId)
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
                    platform,
                    membershipId,
                    $scope.character.characterBase.characterId
                )
                    .then(function(response) {
                        $scope.items = response.data.Response.data.buckets.Equippable;
                        $scope.definitions = response.data.Response.definitions;
                        //audit.setLoadout($scope.items);
                        //audit.setDefinitions($scope.definitions);
                        $scope.loading.inventory = false;
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

                $scope.setMode($scope.mode, true);
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
                    return i.bucketHash == consts.item_types.other_equippable.types.subclass.bucket;
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

                    $scope.elos = result.data;
                    $scope.loading.elo = false;
                });

            $scope.loading.eloHistory = true;
            $scope.loading.srl = true;
            $scope.loading.character = true;
            $scope.maintenance.character = false;

            api
                .getEloChart(membershipId)
                .then(function(result) {
                    _.each(result.data, function(row) {
                        if (!$scope.eloChart.series[row.mode]) {
                            $scope.eloChart.series[row.mode] = {
                                data: [],
                                name: $scope.modes[row.mode],
                                lineWidth: 2
                            }
                        }
                        $scope.eloChart.series[row.mode].data.push(row);
                    });

                    $scope.eloChartEmpty = Object.keys($scope.eloChart.series).length == 0;

                    return api.getSrl(membershipId);
                })
                .then(function(result) {
                    $scope.srl = result.data;
                    $scope.loading.srl = false;

                    return api.getKdChart(membershipId);
                })
                .then(function(result) {
                    _.each(result.data, function(row) {
                        if (!$scope.kdChart.series[row.mode]) {
                            $scope.kdChart.series[row.mode] = {
                                data: [],
                                name: $scope.modes[row.mode],
                                lineWidth: 2
                            }
                        }
                        $scope.kdChart.series[row.mode].data.push(row);
                    });
                    
                    $scope.loading.eloHistory = false;
                    return bungie.getAccount(platform, membershipId);
                })
                .then(function(response) {
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
