var app = angular.module('app');

app.controller('itemDetailCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$location',
    'gamedata',
    'api',
    'charts',
    'consts',
    'gettextCatalog',
    '$localStorage',

    function ($rootScope, $scope, $stateParams, $location, gamedata, api, charts, consts, gettextCatalog, $localStorage) {
        $scope.tiers = consts.item_tiers;
        $scope.chart = charts.get('item-popularity');
        $scope.chartEmpty = true;
        $scope.hasChart = false;
        $scope.modes = consts.modes;
        $scope.mode = $localStorage.itemMode || 10;

        $scope.setMode = function(mode) {
            $localStorage.itemMode = mode;
            $scope.mode = mode;
            $scope.chartEmpty = true;

            _.each($scope.chart.series, function(series) {
                series.visible = mode == series.mode;

                if (series.mode == mode && series.data.length > 0) {
                    $scope.chartEmpty = false;
                }
            });
        };

        var loadComments = function() {
            if (!window.DISQUS) {
                disqus_config = function () {
                    this.page.identifier = 'item_' + $stateParams.hash;
                };

                var d = document, s = d.createElement('script');
                s.src = '//guardiangg.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            } else {
                window.DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.identifier = 'item_' + $stateParams.hash;
                    }
                });
            }
        };

        var loadChart = function() {
            api
                .getItemPopularityChart($stateParams.hash)
                .then(function(result) {
                    var rank = {};
                    var kd = {};
                    var highest = {kd: -1, rank: -1};

                    _.each(result.data, function(row) {
                        if (!rank[row.mode]) {
                            rank[row.mode] = [];
                            kd[row.mode] = [];
                        }

                        var dt = moment(row.day).unix() * 1000;

                        rank[row.mode].push({ x: dt, y: row.rank });
                        kd[row.mode].push({ x: dt, y: row.kills });

                        if (row.rank < highest.rank || highest.rank === -1) {
                            highest.rank = row.rank;
                        }

                        if (row.kills > highest.kd || highest.kd === -1) {
                            highest.kd = row.kills;
                        }
                    });

                    $scope.chart.series = [];

                    _.each(rank, function(data, mode) {
                        $scope.chart.series.push({
                            mode: mode,
                            data: data,
                            name: gettextCatalog.getString('Rank'),
                            color: '#404040',
                            visible: mode == $scope.mode ? true : false
                        });

                        if (kd[mode]) {
                            $scope.chart.series.push({
                                mode: mode,
                                data: kd[mode],
                                name: gettextCatalog.getString('% of All Kills'),
                                color: '#ecaa4a',
                                yAxis: 1,
                                visible: mode == $scope.mode ? true : false
                            });
                        }
                    });
                });
        }

        gamedata
            .get('items', $stateParams.hash)
            .then(function(r) {
                r.name = r.name || gettextCatalog.getString('[Unnamed Item]');
                $scope.entity = r;
                $rootScope.title = r.name + ' - Items - Guardian.gg';

                $scope.entity._displayStats = [];
                $scope.entity._hiddenStats = [];
                $scope.entity._armorStats = [];

                _.each(consts.stats.display, function(s, idx) {
                    var obj = _.find(r.stats, function(stat) {
                        return stat.hash.toString() === s;
                    });

                    if (!obj) {
                        return;
                    }

                    obj = angular.copy(obj);
                    obj.limit = Math.max(obj.max, 100);
                    obj.order = idx;

                    $scope.entity._displayStats.push(obj);
                });

                _.each(consts.stats.hidden, function(s, idx) {
                    var obj = _.find(r.stats, function(stat) {
                        return stat.hash.toString() === s;
                    });

                    if (!obj) {
                        return;
                    }

                    obj = angular.copy(obj);
                    obj.limit = Math.max(obj.max, 100);
                    obj.order = idx;

                    $scope.entity._hiddenStats.push(obj);
                });

                $scope.entity._displayStats = _.sortBy($scope.entity._displayStats, 'order');
                $scope.entity._hiddenStats = _.sortBy($scope.entity._hiddenStats, 'order');

                $scope.entity._primaryStats = {
                    attack: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.attack;
                    }),
                    defense: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.defense;
                    }),
                    magazine: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.magazine;
                    }),
                    intellect: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.intellect;
                    }),
                    discipline: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.discipline;
                    }),
                    strength: _.find(r.stats, function(stat) {
                        return stat.hash.toString() === consts.stats.strength;
                    })
                }

                $scope.entity._damageType = 0;
                _.each($scope.entity.perks, function(perk) {
                    if ($scope.entity._damageType > 0 && perk.damageType > 0) {
                        $scope.entity._damageType = 5;
                        return;
                    }

                    if (perk.damageType && perk.damageType > 0) {
                        $scope.entity._damageType = perk.damageType;
                    }
                });

                if ($scope.entity._primaryStats.attack) {
                    $scope.hasChart = true;
                    loadChart();
                }

                $scope.isEmblem = _.find($scope.entity.categories, function(cat) {
                    return cat.hash === 19;
                });

                loadComments();
            });
    }
]);
